import {
  Box, Button, Divider, IconButton, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TextField, Typography,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { getRawBrailleCells, getRawContractions } from '../content';

const CELL_FIELDS = [
  'id', 'binary', 'unicode', 'verbal',
  'letterSymbol', 'numberSymbol', 'numberSymbolSpoken',
  'symbol', 'name',
];

function downloadJson(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function importFile(accept, onParsed) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = accept;
  input.onchange = () => {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try { onParsed(JSON.parse(e.target.result)); }
      catch { alert('Invalid JSON file'); }
    };
    reader.readAsText(file);
  };
  input.click();
}

export default function AdminPage() {
  const [cells, setCells] = useState([]);
  const [contractions, setContractions] = useState({});

  useEffect(() => {
    const raw = getRawBrailleCells();
    setCells(Array.isArray(raw) ? [...raw] : [...(raw.cells || [])]);
    setContractions({ ...getRawContractions() });
  }, []);

  // ── Cell editing ──────────────────────────────────────────────────────────
  const updateCell = (index, field, value) => {
    setCells((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const updateCellContractions = (index, value) => {
    const list = value.split(',').map((s) => s.trim()).filter(Boolean);
    updateCell(index, 'contractions', list);
  };

  const updateCellDotSets = (index, value) => {
    const list = value.split(',').map((s) => s.trim()).filter(Boolean);
    updateCell(index, 'dotSets', list.length ? list : undefined);
  };

  const addCell = () => {
    setCells((prev) => [...prev, { id: '', binary: '000000', unicode: '', verbal: '' }]);
  };

  const removeCell = (index) => {
    setCells((prev) => prev.filter((_, i) => i !== index));
  };

  // ── Contraction editing ───────────────────────────────────────────────────
  const [newContrId, setNewContrId] = useState('');
  const [newContrType, setNewContrType] = useState('whole_word');

  const addContraction = () => {
    if (!newContrId.trim()) return;
    setContractions((prev) => ({ ...prev, [newContrId.trim()]: { type: newContrType } }));
    setNewContrId('');
  };

  const removeContraction = (key) => {
    setContractions((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  const updateContractionType = (key, type) => {
    setContractions((prev) => ({ ...prev, [key]: { ...prev[key], type } }));
  };

  // ── Import / Export ───────────────────────────────────────────────────────
  const exportCells = () => {
    downloadJson({ schemaVersion: '2.0', binaryOrder: '321456', cells }, 'braille-cells.json');
  };

  const importCells = () => {
    importFile('.json', (data) => {
      const arr = Array.isArray(data) ? data : data.cells;
      if (Array.isArray(arr)) setCells(arr);
      else alert('Could not find cells array in JSON');
    });
  };

  const exportContractions = () => {
    downloadJson(contractions, 'contractions.json');
  };

  const importContractions = () => {
    importFile('.json', (data) => {
      if (typeof data === 'object' && !Array.isArray(data)) setContractions(data);
      else alert('Expected a JSON object');
    });
  };

  return (
    <Box sx={{ px: { xs: 1, sm: 2 }, pb: 4 }}>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
        Admin: Content Editor
      </Typography>

      {/* ── Braille Cells ──────────────────────────────────────────────── */}
      <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap', alignItems: 'center' }}>
        <Typography variant="h6">Braille Cells</Typography>
        <Button size="small" variant="contained" onClick={importCells}>Import JSON</Button>
        <Button size="small" variant="outlined" onClick={exportCells}>Export JSON</Button>
        <Button size="small" startIcon={<FontAwesomeIcon icon={faPlus} />} onClick={addCell}>Add row</Button>
      </Box>

      <TableContainer component={Paper} sx={{ maxHeight: '55vh', mb: 3 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {CELL_FIELDS.map((f) => (
                <TableCell key={f} sx={{ fontWeight: 700, fontSize: '0.7rem', whiteSpace: 'nowrap' }}>{f}</TableCell>
              ))}
              <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem' }}>dotSets</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem' }}>contractions</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {cells.map((cell, i) => (
              <TableRow key={`${cell.id || ''}-${i}`}>
                {CELL_FIELDS.map((f) => (
                  <TableCell key={f} sx={{ p: 0.25 }}>
                    <TextField
                      size="small"
                      variant="standard"
                      value={cell[f] ?? ''}
                      onChange={(e) => updateCell(i, f, e.target.value)}
                      slotProps={{ input: { sx: { fontSize: '0.75rem' } } }}
                      sx={{ minWidth: f === 'id' ? 120 : f === 'verbal' ? 100 : 60 }}
                    />
                  </TableCell>
                ))}
                <TableCell sx={{ p: 0.25 }}>
                  <TextField
                    size="small"
                    variant="standard"
                    value={(cell.dotSets || []).join(', ')}
                    onChange={(e) => updateCellDotSets(i, e.target.value)}
                    slotProps={{ input: { sx: { fontSize: '0.75rem' } } }}
                    sx={{ minWidth: 80 }}
                  />
                </TableCell>
                <TableCell sx={{ p: 0.25 }}>
                  <TextField
                    size="small"
                    variant="standard"
                    value={(cell.contractions || []).join(', ')}
                    onChange={(e) => updateCellContractions(i, e.target.value)}
                    slotProps={{ input: { sx: { fontSize: '0.75rem' } } }}
                    sx={{ minWidth: 160 }}
                  />
                </TableCell>
                <TableCell sx={{ p: 0 }}>
                  <IconButton size="small" onClick={() => removeCell(i)}><FontAwesomeIcon icon={faTrash} /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Divider sx={{ my: 3 }} />

      {/* ── Contractions ───────────────────────────────────────────────── */}
      <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap', alignItems: 'center' }}>
        <Typography variant="h6">Contractions</Typography>
        <Button size="small" variant="contained" onClick={importContractions}>Import JSON</Button>
        <Button size="small" variant="outlined" onClick={exportContractions}>Export JSON</Button>
      </Box>

      <TableContainer component={Paper} sx={{ maxHeight: '40vh', mb: 2 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(contractions).map(([key, val]) => (
              <TableRow key={key}>
                <TableCell>{key}</TableCell>
                <TableCell sx={{ p: 0.25 }}>
                  <TextField
                    size="small"
                    variant="standard"
                    value={val.type || ''}
                    onChange={(e) => updateContractionType(key, e.target.value)}
                    sx={{ minWidth: 120 }}
                  />
                </TableCell>
                <TableCell sx={{ p: 0 }}>
                  <IconButton size="small" onClick={() => removeContraction(key)}><FontAwesomeIcon icon={faTrash} /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <TextField size="small" label="ID" value={newContrId} onChange={(e) => setNewContrId(e.target.value)} />
        <TextField size="small" label="Type" value={newContrType} onChange={(e) => setNewContrType(e.target.value)} />
        <Button variant="outlined" size="small" startIcon={<FontAwesomeIcon icon={faPlus} />} onClick={addContraction}>Add</Button>
      </Box>
    </Box>
  );
}

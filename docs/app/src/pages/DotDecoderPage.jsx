import { Box, CircularProgress, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';

const DOT_ORDER = [1, 4, 2, 5, 3, 6]; // row-major for 2-col grid → columns 1-2-3 / 4-5-6

export default function DotDecoderPage() {
  const [dotStates, setDotStates] = useState([true, false, false, false, false, false]);
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    fetch(`${import.meta.env.BASE_URL}dot-decoder-content-blank.json`)
      .then((r) => r.json())
      .then((data) => { if (isMounted) { setEntries(Array.isArray(data) ? data : []); setIsLoading(false); } })
      .catch(() => { if (isMounted) { setEntries([]); setIsLoading(false); } });
    return () => { isMounted = false; };
  }, []);

  const binaryString = useMemo(() => {
    let s = '';
    for (let i = 5; i >= 0; i--) s += dotStates[i] ? '1' : '0';
    return s;
  }, [dotStates]);

  const activeEntry = useMemo(
    () => entries.find((e) => e.binary === binaryString),
    [entries, binaryString],
  );

  const toggle = (id) => setDotStates((p) => { const n = [...p]; n[id - 1] = !n[id - 1]; return n; });

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dot Decoder
      </Typography>

      {/* Two-panel layout — plain CSS grid, no MUI Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '280px 1fr' },
          gap: 3,
          alignItems: 'start',
        }}
      >
        {/* ── Dot cell ── */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 112px)',
            gap: 2.5,
            justifyContent: { xs: 'center', md: 'start' },
          }}
        >
          {DOT_ORDER.map((dotId) => {
            const isOn = dotStates[dotId - 1];
            return (
              <Box
                key={dotId}
                role="button"
                aria-pressed={isOn}
                onClick={() => toggle(dotId)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(dotId); } }}
                tabIndex={0}
                sx={{
                  width: 112,
                  height: 112,
                  borderRadius: '50%',
                  border: '2px solid',
                  borderColor: isOn ? 'text.primary' : 'divider',
                  bgcolor: isOn ? 'text.primary' : 'transparent',
                  transition: 'all 180ms ease',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  outline: 'none',
                  '&:focus-visible': { boxShadow: '0 0 0 3px rgba(128,128,128,0.35)' },
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{ color: isOn ? 'background.default' : 'text.primary', fontWeight: 600 }}
                >
                  {dotId}
                </Typography>
              </Box>
            );
          })}
        </Box>

        {/* ── Content box — absolutely fixed size ── */}
        <Box
          sx={{
            height: 376,
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
            overflow: 'auto',
            p: 2,
          }}
        >
          {isLoading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={20} />
              <Typography variant="body2" color="text.secondary">Loading…</Typography>
            </Box>
          ) : (
            <>
              <Typography variant="h5" component="h2" sx={{ mb: 1 }}>
                {activeEntry?.dataDecoded?.titvar || 'No match'}
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                dangerouslySetInnerHTML={{
                  __html: activeEntry?.dataDecoded?.descvar || 'Select a dot pattern to decode.',
                }}
              />
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
}

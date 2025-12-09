import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Switch,
  Slider,
  Box,
  Typography,
  Grid,
  Chip,
  IconButton,
  Divider,
} from '@mui/material';
import { Close, Palette, Visibility, Contrast } from '@mui/icons-material';
import { useSettings, COLOR_PRESETS } from '../../contexts/SettingsContext';
import { DynamicBrailleCell } from '../../utils/brailleCellGenerator';

interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
}

const SettingsDialog: React.FC<SettingsDialogProps> = ({ open, onClose }) => {
  const { settings, updateSettings, resetSettings } = useSettings();
  const [tempHue, setTempHue] = useState(settings.primaryHue);

  const handleColorPreset = (hue: number) => {
    setTempHue(hue);
    updateSettings({ primaryHue: hue });
  };

  const handleHueChange = (event: Event, newValue: number | number[]) => {
    const hue = Array.isArray(newValue) ? newValue[0] : newValue;
    setTempHue(hue);
    updateSettings({ primaryHue: hue });
  };

  // Convert hue to HSL color for preview
  const getPreviewColor = (hue: number) => `hsl(${hue}, 80%, 50%)`;

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" component="div">
          ⚙️ Settings & Appearance
        </Typography>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers>
        <Grid container spacing={4}>
          {/* Theme Settings */}
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Visibility /> Display Mode
              </Typography>
              
              <FormControl component="fieldset" sx={{ mb: 2 }}>
                <FormLabel component="legend">Color Mode</FormLabel>
                <RadioGroup
                  value={settings.colorMode}
                  onChange={(e) => updateSettings({ colorMode: e.target.value as any })}
                >
                  <FormControlLabel value="light" control={<Radio />} label="Light" />
                  <FormControlLabel value="dark" control={<Radio />} label="Dark" />
                  <FormControlLabel value="system" control={<Radio />} label="System Default" />
                </RadioGroup>
              </FormControl>

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.highContrast}
                    onChange={(e) => updateSettings({ highContrast: e.target.checked })}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2">High Contrast Mode</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Increases contrast and uses variable weight fonts
                    </Typography>
                  </Box>
                }
              />
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Color Settings */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Palette /> Theme Color
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" gutterBottom>Color Presets:</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {COLOR_PRESETS.map((preset) => (
                    <Chip
                      key={preset.name}
                      label={preset.name}
                      onClick={() => handleColorPreset(preset.hue)}
                      variant={tempHue === preset.hue ? "filled" : "outlined"}
                      sx={{
                        backgroundColor: tempHue === preset.hue ? getPreviewColor(preset.hue) : 'transparent',
                        color: tempHue === preset.hue ? 'white' : 'inherit',
                        borderColor: getPreviewColor(preset.hue),
                      }}
                    />
                  ))}
                </Box>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" gutterBottom>Custom Hue:</Typography>
                <Box sx={{ px: 2 }}>
                  <Slider
                    value={tempHue}
                    onChange={handleHueChange}
                    min={0}
                    max={359}
                    step={1}
                    marks={[
                      { value: 0, label: 'Red' },
                      { value: 60, label: 'Yellow' },
                      { value: 120, label: 'Green' },
                      { value: 180, label: 'Cyan' },
                      { value: 240, label: 'Blue' },
                      { value: 300, label: 'Magenta' },
                    ]}
                    sx={{
                      '& .MuiSlider-thumb': {
                        backgroundColor: getPreviewColor(tempHue),
                      },
                      '& .MuiSlider-track': {
                        background: `linear-gradient(to right, 
                          hsl(0, 80%, 50%), hsl(60, 80%, 50%), hsl(120, 80%, 50%), 
                          hsl(180, 80%, 50%), hsl(240, 80%, 50%), hsl(300, 80%, 50%), hsl(360, 80%, 50%))
                        `,
                      },
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Braille Cell Settings */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Contrast /> Braille Display Options
            </Typography>

            <FormControl component="fieldset" sx={{ mb: 3, width: '100%' }}>
              <FormLabel component="legend">Outline Box</FormLabel>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                Shows bounding box around dot positions to visualize negative space
              </Typography>
              <RadioGroup
                value={settings.outlineBox}
                onChange={(e) => updateSettings({ outlineBox: e.target.value as any })}
              >
                <FormControlLabel value="off" control={<Radio />} label="Off" />
                <FormControlLabel value="solid-light" control={<Radio />} label="Solid Light" />
                <FormControlLabel value="solid-dark" control={<Radio />} label="Solid Dark" />
                <FormControlLabel value="outline-light" control={<Radio />} label="Outline Light" />
                <FormControlLabel value="outline-dark" control={<Radio />} label="Outline Dark" />
              </RadioGroup>
            </FormControl>

            <FormControl component="fieldset" sx={{ mb: 3, width: '100%' }}>
              <FormLabel component="legend">Ghost Dots</FormLabel>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                Shows faint dots at all positions to help visualize patterns
              </Typography>
              <RadioGroup
                value={settings.ghostDots}
                onChange={(e) => updateSettings({ ghostDots: e.target.value as any })}
              >
                <FormControlLabel value="off" control={<Radio />} label="Off" />
                <FormControlLabel value="dot-light" control={<Radio />} label="Dot Light" />
                <FormControlLabel value="dot-dark" control={<Radio />} label="Dot Dark" />
                <FormControlLabel value="outline-light" control={<Radio />} label="Outline Light" />
                <FormControlLabel value="outline-dark" control={<Radio />} label="Outline Dark" />
              </RadioGroup>
            </FormControl>

            <FormControlLabel
              control={
                <Switch
                  checked={settings.dotShadow}
                  onChange={(e) => updateSettings({ dotShadow: e.target.checked })}
                />
              }
              label="Dot Shadow"
            />

            {/* Preview */}
            <Box sx={{ mt: 3, p: 2, backgroundColor: 'background.paper', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="body2" gutterBottom>Preview:</Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'center' }}>
                <DynamicBrailleCell pattern="100000" character="A" size="large" />
                <DynamicBrailleCell pattern="110000" character="B" size="large" />
                <DynamicBrailleCell pattern="100100" character="C" size="large" />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={resetSettings} color="inherit">
          Reset to Defaults
        </Button>
        <Button onClick={onClose} variant="contained">
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SettingsDialog;
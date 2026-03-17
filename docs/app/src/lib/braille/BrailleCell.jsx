import { useTheme } from '@mui/material/styles';
import '../../styles/braille-renderer.css';

function dotIsRaised(pattern, index) {
  if (!pattern || typeof pattern !== 'string') {
    return false;
  }

  return pattern[index] === '1';
}

export default function BrailleCell({ pattern = '000000', size = 'md', label = 'Braille cell' }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const classes = `braille-cell braille-cell--${size}`;

  const themeVars = {
    '--cell-dot-color': isDark ? '#e4e4e4' : '#1a1a1a',
    '--cell-border-color': isDark ? 'rgba(228,228,228,0.2)' : 'rgba(26,26,26,0.2)',
  };

  return (
    <span className={classes} role="img" aria-label={label} style={themeVars}>
      {[0, 1, 2, 3, 4, 5].map((index) => (
        <span
          key={index}
          className={`braille-dot ${dotIsRaised(pattern, index) ? 'is-raised' : 'is-flat'}`}
        />
      ))}
    </span>
  );
}

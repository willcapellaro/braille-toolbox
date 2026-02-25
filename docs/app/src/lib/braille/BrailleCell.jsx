import '../../styles/braille-renderer.css';

function dotIsRaised(pattern, index) {
  if (!pattern || typeof pattern !== 'string') {
    return false;
  }

  return pattern[index] === '1';
}

export default function BrailleCell({ pattern = '000000', size = 'md', label = 'Braille cell' }) {
  const classes = `braille-cell braille-cell--${size}`;

  return (
    <span className={classes} role="img" aria-label={label}>
      {[0, 1, 2, 3, 4, 5].map((index) => (
        <span
          key={index}
          className={`braille-dot ${dotIsRaised(pattern, index) ? 'is-raised' : 'is-flat'}`}
        />
      ))}
    </span>
  );
}

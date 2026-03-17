import { Chip, Tooltip } from '@mui/material';

function getMeaningLabel(meaning) {
  if (meaning.value) {
    return `${meaning.value}`;
  }
  if (meaning.indicatorType) {
    return meaning.indicatorType;
  }
  if (meaning.formatType) {
    return meaning.formatType;
  }
  if (meaning.description) {
    return meaning.description;
  }
  return meaning.type;
}

function buildTooltipContent(meaning) {
  const typeLabel = meaning.type
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  const lines = [];
  lines.push(`Type: ${typeLabel}`);

  if (meaning.value) lines.push(`Value: "${meaning.value}"`);
  if (meaning.name) lines.push(`Name: ${meaning.name}`);
  if (meaning.indicatorType) lines.push(`Indicator: ${meaning.indicatorType}`);
  if (meaning.formatType) lines.push(`Format: ${meaning.formatType}`);
  if (meaning.description) lines.push(`\n${meaning.description}`);

  if (meaning.requiresSpacesAround) lines.push('\n⚠ Requires spaces around');
  if (meaning.requiresNumericIndicator) lines.push('⚠ Requires numeric indicator');
  if (meaning.standingAlone) lines.push('⚠ Standing alone');
  if (meaning.scope) lines.push(`Scope: ${meaning.scope}`);
  if (meaning.position) lines.push(`Position: ${meaning.position}`);

  return lines.join('\n');
}

export default function MeaningBadge({ meaning, size = 'medium', showType = false }) {
  const label = getMeaningLabel(meaning);
  const typeLabel = meaning.type
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  const tooltipContent = buildTooltipContent(meaning);

  return (
    <Tooltip title={tooltipContent} arrow placement="top">
      <Chip
        label={showType ? `${label} (${typeLabel})` : label}
        size={size === 'small' ? 'small' : 'medium'}
        variant="outlined"
        sx={{
          fontWeight: 500,
          fontSize: size === 'small' ? '0.75rem' : '0.875rem',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          '&:hover': {
            opacity: 0.9,
            transform: 'scale(1.05)',
          },
        }}
      />
    </Tooltip>
  );
}

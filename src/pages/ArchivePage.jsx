import { Box, Tab, Tabs, Typography } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import DotDecoderPage from './DotDecoderPage';
import WritePage from './WritePage';
import BraillewriterHelpPage from './BraillewriterHelpPage';

const TABS = [
  { key: 'decode',       label: 'Dot Decoder' },
  { key: 'write',        label: 'Write in Braille' },
  { key: 'braillewriter', label: 'Braillewriter Help' },
];

export default function ArchivePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') || 'decode';
  const tabIndex = Math.max(0, TABS.findIndex((t) => t.key === tabParam));

  const handleTab = (_e, newIndex) => {
    setSearchParams({ tab: TABS[newIndex].key });
  };

  return (
    <Box sx={{ px: { xs: 1, sm: 2 }, pb: 2 }}>
      <Typography variant="h5" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
        More Tools
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs
          value={tabIndex}
          onChange={handleTab}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
        >
          {TABS.map((t) => (
            <Tab key={t.key} label={t.label} />
          ))}
        </Tabs>
      </Box>

      {tabParam === 'decode'        && <DotDecoderPage />}
      {tabParam === 'write'         && <WritePage />}
      {tabParam === 'braillewriter' && <BraillewriterHelpPage />}
    </Box>
  );
}

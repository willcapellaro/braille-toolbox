import { Box, Tab, Tabs, Typography } from '@mui/material';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import DotDecoderPage from './DotDecoderPage';
import WritePage from './WritePage';
import BraillewriterHelpPage from './BraillewriterHelpPage';

const TABS = [
  { key: 'intro', label: 'Intro to Braille' },
  { key: 'decode', label: 'Dot Decoder' },
  { key: 'write', label: 'Write in Braille' },
  { key: 'braillewriter', label: 'Braillewriter Help' },
];

export default function ArchivePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') || 'intro';
  const tabIndex = Math.max(0, TABS.findIndex((t) => t.key === tabParam));
  const iframeRef = useRef(null);
  const [iframeHeight, setIframeHeight] = useState(800);

  const resizeIframe = useCallback(() => {
    try {
      const doc = iframeRef.current?.contentDocument || iframeRef.current?.contentWindow?.document;
      if (doc?.body) {
        setIframeHeight(doc.body.scrollHeight + 32);
      }
    } catch { /* cross-origin guard */ }
  }, []);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    iframe.addEventListener('load', resizeIframe);
    return () => iframe.removeEventListener('load', resizeIframe);
  }, [resizeIframe]);

  const handleTab = (_e, newIndex) => {
    setSearchParams({ tab: TABS[newIndex].key });
  };

  return (
    <Box sx={{ px: { xs: 1, sm: 2 }, pb: 2 }}>
      <Typography variant="h5" component="h1" sx={{ fontWeight: 700, mb: 0.5 }}>
        More Tools
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        All features are being rebuilt in 2026. The Intro to Braille below is the original version.
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

      {tabParam === 'intro' && (
        <Box
          component="iframe"
          ref={iframeRef}
          src={`${import.meta.env.BASE_URL}archive/intro.html`}
          title="Introduction to Braille (archived)"
          sx={{
            width: '100%',
            height: iframeHeight,
            border: 'none',
            display: 'block',
          }}
        />
      )}
      {tabParam === 'decode' && <DotDecoderPage />}
      {tabParam === 'write' && <WritePage />}
      {tabParam === 'braillewriter' && <BraillewriterHelpPage />}
    </Box>
  );
}
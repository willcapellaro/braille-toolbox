import {
  Box,
  Button,
  Divider,
  Link as MuiLink,
  Tooltip,
  Typography,
} from '@mui/material';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import BrailleInteractiveToken from '../components/braille/BrailleInteractiveToken';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink, faCopy, faCheck } from '@fortawesome/free-solid-svg-icons';
import fullExplainerMarkdown from '../content/full-explainer.md?raw';

// ── Quick-reference grid layout ─────────────────────────────────────────────
const LETTER_GRID = [
  ['capital-sign', 'number-sign', null, null, null, null, null, null, null, null],
  ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'],
  ['k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't'],
  ['u', 'v', 'x', 'y', 'z', null, null, null, null, 'w'],
];

const PUNCTUATION_IDS = [
  'punctuation-period', 'punctuation-comma', 'punctuation-exclamation',
  'punctuation-question', 'punctuation-colon', 'punctuation-semicolon',
  'punctuation-quote-open', 'punctuation-quote-close',
  'punctuation-single-quote-open', 'punctuation-single-quote-close',
  'punctuation-parenthesis-open', 'punctuation-parenthesis-close',
  'punctuation-bracket-open', 'punctuation-bracket-close',
  'punctuation-hyphen', 'punctuation-dash', 'punctuation-apostrophe',
  'punctuation-asterisk', 'punctuation-slash', 'punctuation-ellipsis',
  'punctuation-dollar',
];

function toGrid(items, columns = 10) {
  const rows = [];
  for (let i = 0; i < items.length; i += columns) {
    const row = items.slice(i, i + columns);
    while (row.length < columns) row.push(null);
    rows.push(row);
  }
  return rows;
}

// ── Markdown helpers (from former IntroPage) ────────────────────────────────
const INTERNAL_ROUTE_MAP = {
  'intro.html': '/quickref',
  'quickref.html': '/quickref',
  'write.html': '/write',
  'decode.html': '/decode',
  'about.html': '/about',
  'archive.html': '/archive',
  'braillewriter.html': '/braillewrite-help',
};

function transformBrailleMarkers(markdown) {
  return markdown.replace(/\[\[br:([^\]]+)\]\]/g, (_, spec) => {
    const escaped = String(spec).replace(/"/g, '&quot;');
    return `<braille-token spec="${escaped}"></braille-token>`;
  });
}

/**
 * Convert dot-number string (e.g. "1", "236") to a Unicode braille character.
 * Braille Unicode block: U+2800, each dot is a bit (dot1=bit0 … dot6=bit5).
 */
function dotsToUnicodeChar(dotStr) {
  let code = 0x2800;
  String(dotStr).split('').forEach((ch) => {
    const d = Number(ch);
    if (d >= 1 && d <= 6) code |= 1 << (d - 1);
  });
  return String.fromCodePoint(code);
}

/**
 * Extract a section's raw text from the markdown source, formatted for clipboard.
 * Converts [[br:...]] to Unicode braille + (dots ...) and strips HTML to plain text.
 */
function extractSectionText(sectionId) {
  const raw = fullExplainerMarkdown;

  // Find section start: <h1-3 id="sectionId">
  const headingRe = new RegExp(`<h([1-3])\\s+id="${sectionId}"[^>]*>`, 'i');
  const startMatch = headingRe.exec(raw);
  if (!startMatch) return null;

  const level = Number(startMatch[1]);
  const startIdx = startMatch.index;

  // Find next heading of same or higher level (lower number)
  const rest = raw.slice(startIdx + startMatch[0].length);
  const nextHeadingRe = new RegExp(`<h([1-${level}])\\s+id=`, 'i');
  const endMatch = nextHeadingRe.exec(rest);
  const sectionRaw = endMatch
    ? raw.slice(startIdx, startIdx + startMatch[0].length + endMatch.index)
    : raw.slice(startIdx);

  // Convert to plain text
  let text = sectionRaw;

  // Convert [[br:...]] → Unicode braille chars
  text = text.replace(/\[\[br:([^\]]+)\]\]/g, (_, spec) => {
    const parts = spec.trim().split(/\s+/);
    const dotParts = parts.filter((p) => /^[1-6]+$/.test(p));
    const idParts = parts.filter((p) => p.startsWith('id:'));

    if (dotParts.length > 0) {
      const brailleChars = dotParts.map(dotsToUnicodeChar).join('');
      return brailleChars;
    }
    if (idParts.length > 0) {
      return ''; // id-only refs (images) — omit gracefully
    }
    return `[${spec}]`;
  });

  // Strip HTML comments
  text = text.replace(/<!--[\s\S]*?-->/g, '');
  // <li> → newline + tab indent, with content on same line
  text = text.replace(/<li[^>]*>/gi, '\n  ');
  // <p> → double newline
  text = text.replace(/<p[^>]*>/gi, '\n\n');
  // </p>, </li>, </ul> → newline
  text = text.replace(/<\/(p|li|ul)>/gi, '\n');
  // Headings → title line
  text = text.replace(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/gi, (_, inner) => {
    const clean = inner.replace(/<[^>]+>/g, '').trim();
    return `\n${clean}\n${'─'.repeat(clean.length)}\n`;
  });
  // Strip remaining HTML tags
  text = text.replace(/<[^>]+>/g, '');
  // Decode common HTML entities
  text = text.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ')
    .replace(/&#8220;/g, '\u201C').replace(/&#8221;/g, '\u201D')
    .replace(/&#8216;/g, '\u2018').replace(/&#8217;/g, '\u2019')
    .replace(/&#8208;/g, '-').replace(/&#8212;/g, '\u2014')
    .replace(/&#8593;/g, '\u2191')
    .replace(/&#\d+;/g, (m) => String.fromCharCode(Number(m.slice(2, -1))));
  // Collapse excessive whitespace but preserve paragraph breaks
  text = text.replace(/[ \t]+/g, ' ');
  text = text.replace(/\n{3,}/g, '\n\n');
  text = text.trim();

  return text;
}

function resolveRoute(href = '') {
  if (!href) return null;
  return INTERNAL_ROUTE_MAP[href.toLowerCase()] || null;
}

// Hoverable anchor icon on headings with copy-to-clipboard tooltip
function HeadingWithAnchor({ variant, component, sx, id, children, ...props }) {
  const [linkCopied, setLinkCopied] = useState(false);
  const [textCopied, setTextCopied] = useState(false);

  const handleCopyLink = (e) => {
    e.preventDefault();
    const url = `${window.location.origin}${window.location.pathname}#/quickref?section=${id}`;
    navigator.clipboard.writeText(url).then(() => {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 1500);
    });
  };

  const handleCopyText = (e) => {
    e.preventDefault();
    const text = extractSectionText(id);
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setTextCopied(true);
      setTimeout(() => setTextCopied(false), 1500);
    });
  };

  const actionSx = {
    opacity: 0,
    transition: 'opacity 0.2s',
    fontSize: '0.55em',
    verticalAlign: 'middle',
    textDecoration: 'none',
    color: 'text.secondary',
    cursor: 'pointer',
    border: 0,
    background: 'none',
    p: 0,
    fontFamily: 'inherit',
    '&:hover': { opacity: '1 !important', color: 'primary.main' },
  };

  return (
    <Typography
      variant={variant}
      component={component}
      id={id}
      sx={{
        ...sx,
        position: 'relative',
        '&:hover .heading-action': { opacity: 0.6 },
      }}
      {...props}
    >
      {children}
      {id && (
        <Box component="span" sx={{ ml: 1, display: 'inline-flex', gap: 0.5, verticalAlign: 'middle' }}>
          <Tooltip title={linkCopied ? 'Copied!' : 'Copy section link'} arrow placement="top">
            <MuiLink
              className="heading-action"
              href={`#/quickref?section=${id}`}
              onClick={handleCopyLink}
              sx={actionSx}
            >
              <FontAwesomeIcon icon={linkCopied ? faCheck : faLink} />
            </MuiLink>
          </Tooltip>
          <Tooltip title={textCopied ? 'Copied!' : 'Copy section text'} arrow placement="top">
            <Box
              component="button"
              type="button"
              className="heading-action"
              onClick={handleCopyText}
              sx={actionSx}
            >
              <FontAwesomeIcon icon={textCopied ? faCheck : faCopy} />
            </Box>
          </Tooltip>
        </Box>
      )}
    </Typography>
  );
}

const markdownComponents = {
  h1: ({ children, id, ...props }) => (
    <HeadingWithAnchor variant="h5" component="h2" sx={{ mt: 4, mb: 1.5, fontWeight: 700 }} id={id} {...props}>
      {children}
    </HeadingWithAnchor>
  ),
  h2: ({ children, id, ...props }) => (
    <HeadingWithAnchor variant="h6" component="h3" sx={{ mt: 3, mb: 1.25, position: 'sticky', top: 0, zIndex: 2, bgcolor: 'background.default', py: 0.75 }} id={id} {...props}>
      {children}
    </HeadingWithAnchor>
  ),
  h3: ({ children, id, ...props }) => (
    <HeadingWithAnchor
      variant="subtitle1"
      component="h4"
      sx={{
        mt: 2,
        mb: 1,
        fontWeight: 600,
        position: 'sticky',
        top: 0,
        zIndex: 1,
        bgcolor: 'background.default',
        py: 0.75,
        borderBottom: 1,
        borderColor: 'divider',
        display: 'flex',
        alignItems: 'center',
        gap: 0.75,
        '& .braille-cell': {
          '--cell-dot-size': '6px',
          '--cell-gap': '4px',
          padding: '5px',
          borderRadius: '6px',
        },
      }}
      id={id}
      {...props}
    >
      {children}
    </HeadingWithAnchor>
  ),
  p: ({ children, ...props }) => (
    <Typography variant="body1" sx={{ mb: 1.25, lineHeight: 1.65 }} {...props}>
      {children}
    </Typography>
  ),
  ul: ({ children, className = '', ...props }) => {
    const classes = className.split(' ').filter(Boolean);
    const isInfostrip = classes.includes('infostrip');
    const isGrid10 = classes.includes('grid10');
    const isSpan2 = classes.includes('span2');

    return (
      <Box
        component="ul"
        sx={{
          listStyle: 'none',
          p: 0,
          m: 0,
          mb: 2,
          display: isInfostrip ? 'grid' : 'block',
          gridTemplateColumns: isInfostrip
            ? {
                xs: isSpan2 ? 'repeat(2, minmax(0, 1fr))' : 'repeat(2, minmax(0, 1fr))',
                sm: isGrid10 ? 'repeat(5, minmax(0, 1fr))' : 'repeat(3, minmax(0, 1fr))',
                md: isGrid10 ? 'repeat(10, minmax(0, 1fr))' : 'repeat(4, minmax(0, 1fr))',
              }
            : undefined,
          gap: isInfostrip ? 0.8 : 0,
        }}
        {...props}
      >
        {children}
      </Box>
    );
  },
  li: ({ children, ...props }) => (
    <Box
      component="li"
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.75,
        py: 0.2,
        minHeight: 44,
        flexWrap: 'wrap',
      }}
      {...props}
    >
      {children}
    </Box>
  ),
  div: ({ children, ...props }) => (
    <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }} {...props}>
      {children}
    </Box>
  ),
  a: ({ href, children, ...props }) => {
    const route = resolveRoute(href);
    if (route) {
      return (
        <MuiLink component={RouterLink} to={route} underline="hover" {...props}>
          {children}
        </MuiLink>
      );
    }
    return (
      <MuiLink href={href} underline="hover" target="_blank" rel="noreferrer" {...props}>
        {children}
      </MuiLink>
    );
  },
  'braille-token': ({ node, ...props }) => {
    const spec = props.spec || node?.properties?.spec || '';
    return <BrailleInteractiveToken spec={spec} variant="inline" />;
  },
};

// ── Page ────────────────────────────────────────────────────────────────────
export default function QuickRefPage() {
  const [searchParams] = useSearchParams();
  const sectionParam = searchParams.get('section');
  const fullParam = searchParams.has('full');

  // Auto-expand when ?section=<id> or ?full is present
  const [showExplainer, setShowExplainer] = useState(Boolean(sectionParam || fullParam));
  const explainerRef = useRef(null);
  const scrolledRef = useRef(false);
  const markdown = useMemo(() => transformBrailleMarkers(fullExplainerMarkdown), []);

  // Scroll to section after explainer renders
  useEffect(() => {
    if (!sectionParam || scrolledRef.current) return;
    if (!showExplainer) { setShowExplainer(true); return; }

    // Small delay to let Collapse + ReactMarkdown render
    const timer = setTimeout(() => {
      const el = document.getElementById(sectionParam);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        scrolledRef.current = true;
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [sectionParam, showExplainer]);

  const renderCell = (id, key) => {
    if (!id) return <Box key={key} sx={{ minHeight: { xs: 64, md: 74 } }} />;
    return (
      <BrailleInteractiveToken
        key={key}
        cellId={id}
        variant="grid"
      />
    );
  };

  return (
    <Box sx={{ px: { xs: 1, sm: 2 }, pb: 2 }}>
      {/* ── Quick Reference Grid ── */}

      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: 'repeat(5, minmax(0, 1fr))', md: 'repeat(10, minmax(0, 1fr))' },
        columnGap: { xs: 0.25, md: 0.9 },
        rowGap: { xs: 0.45, md: 0.9 },
      }}>
        {LETTER_GRID.flat().map((id, i) => renderCell(id, `alpha-${i}`))}
      </Box>

      <Divider sx={{ my: 1.5 }} />

      <Typography variant="subtitle2" sx={{ mb: 0.75 }}>Punctuation</Typography>
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: 'repeat(5, minmax(0, 1fr))', md: 'repeat(10, minmax(0, 1fr))' },
        columnGap: { xs: 0.25, md: 0.9 },
        rowGap: { xs: 0.45, md: 0.9 },
      }}>
        {toGrid(PUNCTUATION_IDS).flat().map((id, i) => renderCell(id, `punct-${i}`))}
      </Box>

      {/* ── Learn Braille (collapsed by default) ── */}
      <Divider sx={{ my: 3 }} />

      {!showExplainer ? (
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <Button variant="outlined" onClick={() => setShowExplainer(true)}>
            Read more about braille  
          </Button>
        </Box>
      ) : (
        <Box ref={explainerRef}>
          <ReactMarkdown rehypePlugins={[rehypeRaw]} components={markdownComponents}>
            {markdown}
          </ReactMarkdown>
        </Box>
      )}
    </Box>
  );
}

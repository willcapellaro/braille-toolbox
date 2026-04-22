import {
  Box,
  Divider,
  Link as MuiLink,
  Popover,
  SwipeableDrawer,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link as RouterLink, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import BrailleInteractiveToken from '../components/braille/BrailleInteractiveToken';
import CellPopover from '../components/braille/CellPopover';
import BrailleCell from '../lib/braille/BrailleCell';
import { dotsToPattern, resolveAsciiBrailleSpec } from '../content';
import { useSiteSettings } from '../App';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink, faCopy, faCheck } from '@fortawesome/free-solid-svg-icons';
import fullExplainerMarkdown from '../content/full-explainer.md?raw';
import contractionsNewMarkdown from '../content/contractions-new.md?raw';
import introNewMarkdown from '../content/intro-new.md?raw';

// ── Quick-reference grid layout ─────────────────────────────────────────────
// Quick-reference content as markdown — same pipeline as learn content
const QUICK_REF_MARKDOWN = `
<ul class="infostrip grid2">
<li>[[br:6]] cap</li>
<li>[[br:3456]] #</li>
</ul>

<ul class="infostrip grid10">
<li>[[br:1]] a · 1</li>
<li>[[br:12]] b · 2</li>
<li>[[br:14]] c · 3</li>
<li>[[br:145]] d · 4</li>
<li>[[br:15]] e · 5</li>
<li>[[br:124]] f · 6</li>
<li>[[br:1245]] g · 7</li>
<li>[[br:125]] h · 8</li>
<li>[[br:24]] i · 9</li>
<li>[[br:245]] j · 0</li>
</ul>

<ul class="infostrip grid10">
<li>[[br:13]] k</li>
<li>[[br:123]] l</li>
<li>[[br:134]] m</li>
<li>[[br:1345]] n</li>
<li>[[br:135]] o</li>
<li>[[br:1234]] p</li>
<li>[[br:12345]] q</li>
<li>[[br:1235]] r</li>
<li>[[br:234]] s</li>
<li>[[br:2345]] t</li>
</ul>

<ul class="infostrip grid10">
<li>[[br:136]] u</li>
<li>[[br:1236]] v</li>
<li>[[br:1346]] x</li>
<li>[[br:13456]] y</li>
<li>[[br:1356]] z</li>
<li>[[br:2456]] w</li>
</ul>

<ul class="infostrip grid10">
<li>[[br:256]] .</li>
<li>[[br:2]] ,</li>
<li>[[br:235]] !</li>
<li>[[br:236]] ?</li>
<li>[[br:25]] :</li>
<li>[[br:23]] ;</li>
<li>[[br:236]] &#8220;</li>
<li>[[br:356]] &#8221;</li>
<li>[[br:6 236]] &#8216;</li>
<li>[[br:6 356]] &#8217;</li>
<li>[[br:5 126]] (</li>
<li>[[br:5 345]] )</li>
<li>[[br:46 126]] [</li>
<li>[[br:46 345]] ]</li>
<li>[[br:36]] &#8208;</li>
<li>[[br:6 36]] &#8212;</li>
<li>[[br:3]] &#39;</li>
<li>[[br:5 35]] *</li>
<li>[[br:456 34]] /</li>
<li>[[br:256 256 256]] &#8230;</li>
<li>[[br:4 234]] $</li>
</ul>
`;

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
  return markdown
    .replace(/\[\[br:([^\]]+)\]\]/g, (_, spec) => {
      const escaped = String(spec).replace(/"/g, '&quot;');
      return `<braille-token spec="${escaped}"></braille-token>`;
    })
    .replace(/\[\[capt:([^\]]+)\]\]/g, (_, spec) => {
      const escaped = String(spec).replace(/"/g, '&quot;');
      return `<capt-token spec="${escaped}"></capt-token>`;
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


// ── Learn nav data ───────────────────────────────────────────────────────────

// Letter → braille dot pattern (for nav cells and contraction grid)
const LETTER_DOTS = {
  a:'1', b:'12', c:'14', d:'145', e:'15', f:'124', g:'1245', h:'125', i:'24', j:'245',
  k:'13', l:'123', m:'134', n:'1345', o:'135', p:'1234', q:'12345', r:'1235', s:'234', t:'2345',
  u:'136', v:'1236', w:'2456', x:'1346', y:'13456',
};

const LEARN_NAV_ITEMS = [
  { id: 'intro_new',        label: 'Introduction', braille: '24'    }, // i
  { id: 'letters_new',      label: 'Letters',      braille: '123'   }, // l
  { id: 'numbers_new',      label: 'Numbers',      braille: '3456'  }, // number sign
  { id: 'capitals_new',     label: 'Capitals',     braille: '6'     }, // cap sign
  { id: 'italics_new',      label: 'Italics',      braille: '13'    }, // user specified
  { id: 'punctuation_new',  label: 'Punctuation',  braille: '256'   }, // period
  { id: 'currency_new',     label: 'Currency',     braille: '4'     }, // currency sign
];

const CONTRACTION_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWY'.split('');

const ALL_NAV_IDS = [
  ...LEARN_NAV_ITEMS.map(i => i.id),
  'contractions_new',
  ...CONTRACTION_LETTERS.map(l => `${l.toLowerCase()}_contractions_new`),
];

// Nav button base — explicitly sets the design system font var so buttons don't fall back to browser default
const navBtnBase = {
  fontFamily: 'var(--bt-font-family)',
  border: 0, background: 'none', cursor: 'pointer', textAlign: 'left', p: 0, m: 0,
};

const NAV_W = 200; // sidebar width px

/** Non-interactive braille cell in caption style — same visual as CaptionedBrailleGrid captions but no hover/popover. */
function NavBrailleCell({ dots }) {
  return (
    <Box sx={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: 20, height: 26, boxSizing: 'border-box', flexShrink: 0,
      border: '1px solid var(--bt-border)', borderRadius: '3px',
    }}>
      <BrailleCell
        pattern={dotsToPattern(dots)}
        size="xs"
        label={dots}
        style={{ border: 'none', borderRadius: '2px', '--cell-dot-size': '4px', '--cell-gap': '3px', padding: '3px' }}
      />
    </Box>
  );
}

function NavItem({ label, braille, isActive, onClick }) {
  return (
    <Box
      component="button"
      type="button"
      onClick={onClick}
      sx={{
        ...navBtnBase,
        display: 'flex', alignItems: 'center', gap: '8px',
        width: '100%', px: 1.5, py: '4px',
        fontSize: '1.125rem',
        fontWeight: isActive ? 700 : 400,
        color: isActive ? 'text.primary' : 'text.secondary',
        borderLeft: '3px solid',
        borderColor: isActive ? 'text.primary' : 'transparent',
        bgcolor: isActive ? 'action.selected' : 'transparent',
        lineHeight: 1.7,
        '&:hover': { color: 'text.primary', bgcolor: 'action.hover' },
      }}
    >
      {braille && <NavBrailleCell dots={braille} />}
      {label}
    </Box>
  );
}

const navLinkSx = {
  fontFamily: 'var(--bt-font-family)',
  fontSize: '1rem', lineHeight: 1.7,
  color: 'text.secondary',
  textDecoration: 'none',
  display: 'block', px: 1.5, py: '2px',
  '&:hover': { color: 'text.primary' },
};

function NavContents({ activeId, onNavClick, onQuickRef }) {
  return (
    <Box sx={{ py: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Quick Reference scroll-to-top */}
      <NavItem label="Quick Ref" braille="12345" isActive={!activeId} onClick={onQuickRef} />
      <Divider sx={{ my: 0.75, mx: 1 }} />
      {/* Introduction sections — flat */}
      {LEARN_NAV_ITEMS.map(item => (
        <NavItem
          key={item.id}
          label={item.label}
          braille={item.braille}
          isActive={activeId === item.id}
          onClick={() => onNavClick(item.id)}
        />
      ))}
      <Divider sx={{ my: 0.75, mx: 1 }} />
      {/* Contractions section label */}
      <Box
        component="button"
        type="button"
        onClick={() => onNavClick('contractions_new')}
        sx={{
          ...navBtnBase,
          display: 'flex', alignItems: 'center', gap: '8px',
          width: '100%', px: 1.5, py: '4px',
          fontSize: '1.125rem', lineHeight: 1.7,
          fontWeight: activeId === 'contractions_new' ? 700 : 600,
          color: activeId === 'contractions_new' ? 'text.primary' : 'text.secondary',
          borderLeft: '2px solid',
          borderColor: activeId === 'contractions_new' ? 'text.primary' : 'transparent',
          '&:hover': { color: 'text.primary' },
        }}
      >
        Contractions
      </Box>
      {/* Contraction letter grid: 5 columns, each cell = braille + print letter */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', px: 1, pb: 1, gap: '3px' }}>
        {CONTRACTION_LETTERS.map(letter => {
          const lower = letter.toLowerCase();
          const dots = LETTER_DOTS[lower] || '0';
          const active = activeId === `${lower}_contractions_new`;
          return (
            <Box
              key={letter}
              component="button"
              type="button"
              onClick={() => onNavClick(`${lower}_contractions_new`)}
              sx={{
                ...navBtnBase,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                gap: '1px', py: '4px',
                border: '1px solid',
                borderColor: active ? 'text.primary' : 'transparent',
                borderRadius: '3px',
                color: active ? 'text.primary' : 'text.secondary',
                bgcolor: active ? 'action.selected' : 'transparent',
                fontWeight: active ? 700 : 400,
                '&:hover': { color: 'text.primary', borderColor: 'text.secondary', bgcolor: 'action.hover' },
              }}
            >
              <NavBrailleCell dots={dots} />
              <Box component="span" sx={{ fontFamily: 'var(--bt-font-family)', fontSize: '0.85rem', fontWeight: active ? 700 : 400, lineHeight: 1.2 }}>
                {letter}
              </Box>
            </Box>
          );
        })}
      </Box>
      {/* Footer links at bottom of sidebar */}
      <Box sx={{ mt: 'auto', pt: 1, borderTop: '1px solid', borderColor: 'divider', mx: 1, pb: 1 }}>
        <MuiLink component={RouterLink} to="/about" sx={navLinkSx}>About</MuiLink>
        <MuiLink component={RouterLink} to="/archive" sx={navLinkSx}>More Tools</MuiLink>
        <MuiLink component={RouterLink} to="/games/solitaire" sx={navLinkSx}>Braille Solitaire</MuiLink>
        <MuiLink href="https://willcapellaro1.typeform.com/to/oPcfuyiL" sx={navLinkSx} target="_blank" rel="noreferrer">Feedback</MuiLink>
        <Typography variant="caption" color="text.disabled" sx={{ display: 'block', px: 1.5, pt: 0.5 }}>
          © 2026 Will Capellaro
        </Typography>
      </Box>
    </Box>
  );
}

/**
 * Table of contents for the Learn Braille section.
 * Wide (≥ xl): position:fixed in the left margin via CSS transform — never pushes content.
 * Narrow / mobile: floating FAB, opens a SwipeableDrawer with identical content.
 */
function LearnNav() {
  const { sidebarOpen, setSidebarOpen } = useSiteSettings();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isWide = useMediaQuery(theme.breakpoints.up('xl'));
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const els = ALL_NAV_IDS.map(id => document.getElementById(id)).filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-10% 0px -60% 0px', threshold: 0 }
    );
    els.forEach(el => observer.observe(el));

    // Reset to Quick Ref when scrolled back to top
    const onScroll = () => { if (window.scrollY < 80) setActiveId(''); };
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => { observer.disconnect(); window.removeEventListener('scroll', onScroll); };
  }, []);

  const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'instant', block: 'start' });
    } else {
      // Content not rendered yet — navigate to /learn then scroll after render
      navigate('/learn');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'instant', block: 'start' });
      }, 80);
    }
    if (!isWide) setSidebarOpen(false);
  };

  const handleNavClick = (id) => scrollToId(id);

  const handleQuickRef = () => {
    if (location.pathname !== '/' && location.pathname !== '/quickref') navigate('/');
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (!isWide) setSidebarOpen(false);
  };

  if (isWide) {
    return (
      <>
        {/* Sidebar panel — slides out of view when closed via transform */}
        <Box sx={{
          position: 'fixed', left: 0, top: 48, zIndex: 10,
          width: NAV_W,
          height: 'calc(100vh - 48px)',
          overflowY: 'auto',
          bgcolor: 'background.default',
          borderRight: '1px solid', borderColor: 'divider',
          transform: sidebarOpen ? 'translateX(0)' : `translateX(-${NAV_W}px)`,
          transition: 'transform 0.2s ease',
        }}>
          <NavContents activeId={activeId} onNavClick={handleNavClick} onQuickRef={handleQuickRef} />
        </Box>
      </>
    );
  }

  // Mobile: drawer driven by sidebarOpen in context, opened by header chevron
  return (
    <SwipeableDrawer
      anchor="left"
      open={sidebarOpen}
      onClose={() => setSidebarOpen(false)}
      onOpen={() => setSidebarOpen(true)}
      disableScrollLock
      slotProps={{ paper: { sx: { width: 260, top: 48, height: 'calc(100% - 48px)' } } }}
    >
      <NavContents activeId={activeId} onNavClick={handleNavClick} onQuickRef={handleQuickRef} />
    </SwipeableDrawer>
  );
}

/**
 * Clickable wrapper for any braille cell or caption cell in the explainer.
 * Accepts a `spec` string (raw dot numbers like "25", letter like "c", or id like "number-sign")
 * and opens CellPopover on click. Falls back to non-interactive if unresolvable.
 * Forward `sx` for all box appearance — the button itself is transparent/borderless by default.
 */
/**
 * dimmed: this cell's sibling has the popover open — fade back to 80%
 * onOpenChange(bool): notify parent when this cell's popover opens/closes
 * Popover anchors to the closest <li> ancestor so it opens below the full item (cells + label).
 */
function InteractiveCellButton({ spec, children, sx = {}, dimmed = false, onOpenChange }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const resolved = useMemo(() => resolveAsciiBrailleSpec(spec), [spec]);
  const lookupId = !resolved.unresolved ? resolved.lookupId : '';

  const open = isMobile ? drawerOpen : Boolean(anchorEl);
  const handleOpen = (e) => {
    if (!lookupId) return;
    // Anchor to the li ancestor so popover appears below the full item (cells + label)
    const liEl = e.currentTarget.closest('li') || e.currentTarget;
    if (isMobile) { setDrawerOpen(true); }
    else { setAnchorEl(liEl); }
    onOpenChange?.(true);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setDrawerOpen(false);
    onOpenChange?.(false);
  };

  return (
    <>
      <Box
        component={lookupId ? 'button' : 'span'}
        type={lookupId ? 'button' : undefined}
        onClick={lookupId ? handleOpen : undefined}
        sx={{
          border: 0, background: 'transparent', p: 0, m: 0,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: '4px',
          cursor: lookupId ? 'pointer' : 'default',
          opacity: dimmed ? 0.35 : 1,
          transition: 'opacity 0.15s',
          '&:hover': lookupId ? { backgroundColor: 'action.hover' } : {},
          '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: '1px' },
          ...sx,
        }}
      >
        {children}
      </Box>
      {lookupId && (isMobile ? (
        <SwipeableDrawer
          anchor="bottom" open={open} onClose={handleClose} onOpen={() => {}}
          disableSwipeToOpen disableScrollLock
          PaperProps={{ sx: { borderTopLeftRadius: 16, borderTopRightRadius: 16, maxHeight: '70vh', overflow: 'auto' } }}
        >
          <Box sx={{ width: 40, height: 4, bgcolor: 'text.disabled', borderRadius: 2, mx: 'auto', mt: 1.5, mb: 0.5 }} />
          <CellPopover cellId={lookupId} />
        </SwipeableDrawer>
      ) : (
        <Popover open={open} anchorEl={anchorEl} onClose={handleClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          transformOrigin={{ vertical: 'top', horizontal: 'center' }}
          disableScrollLock
        >
          <CellPopover cellId={lookupId} />
        </Popover>
      ))}
    </>
  );
}

/**
 * Captioned braille grid: renders [[br:...]] + [[capt:...]] as an interactive inline-grid.
 * Tracks which cell index is active so siblings dim when one is open.
 */
function CaptionedBrailleGrid({ brailleSpec, captSpec }) {
  const [activeIdx, setActiveIdx] = useState(null);

  const brailleParts = brailleSpec.trim().split(/\s+/).filter(p => /^[0-6]+$/.test(p));
  const captParts    = captSpec.trim().split(/\s+/).filter(Boolean);
  const cols         = Math.max(brailleParts.length, captParts.length);

  // xs BrailleCell natural size: dot=6px gap=4px pad=5px border=1px → 28×38px
  const CELL_W   = 28;
  const CELL_GAP = 4;
  const ROW_GAP  = 4;

  const CAPT_W = 22;
  const CAPT_H = 28;
  const captBoxSx = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    width: CAPT_W, height: CAPT_H, boxSizing: 'border-box',
    border: '1px solid var(--bt-border)',
    borderRadius: '4px',
  };
  const captBrailleInnerStyle = {
    border: 'none', borderRadius: '2px',
    '--cell-dot-size': '4px',
    '--cell-gap': '3px',
    padding: '3px',
  };

  return (
    <Box component="span" sx={{
      display: 'inline-grid',
      gridTemplateColumns: `repeat(${cols}, ${CELL_W}px)`,
      columnGap: `${CELL_GAP}px`,
      rowGap: `${ROW_GAP}px`,
      justifyItems: 'center',
    }}>
      {/* Row 1: main braille cells */}
      {brailleParts.map((dots, i) => (
        <InteractiveCellButton
          key={`br-${i}`}
          spec={dots}
          dimmed={activeIdx !== null && activeIdx !== i}
          onOpenChange={(open) => setActiveIdx(open ? i : null)}
        >
          <BrailleCell pattern={dotsToPattern(dots)} size="xs" label={dots} />
        </InteractiveCellButton>
      ))}
      {/* Row 2: caption cells — offset index so braille row 1 and caption row 2 share the activeIdx space */}
      {captParts.map((tok, i) => {
        const captIdx = brailleParts.length + i;
        const dotMatch = tok.match(/^dot([0-6]*)$/i); // dot0 = blank cell
        const isLetter = !dotMatch && /^[a-zA-Z]$/.test(tok);
        const captSpec = dotMatch ? (dotMatch[1] || '0') : tok;
        return (
          <InteractiveCellButton
            key={`cap-${i}`}
            spec={captSpec}
            sx={captBoxSx}
            dimmed={activeIdx !== null && activeIdx !== captIdx}
            onOpenChange={(open) => setActiveIdx(open ? captIdx : null)}
          >
            {dotMatch
              ? <BrailleCell pattern={dotsToPattern(dotMatch[1] || '0')} size="xs" label={tok} style={captBrailleInnerStyle} />
              : isLetter
              ? <Box component="span" sx={{ fontFamily: 'monospace', fontSize: '0.78rem', lineHeight: 1 }}>{tok}</Box>
              : <Box component="span" sx={{ fontFamily: 'monospace', fontSize: '0.6rem', lineHeight: 1, textAlign: 'center' }}>{tok}</Box>
            }
          </InteractiveCellButton>
        );
      })}
    </Box>
  );
}

const markdownComponents = {
  h1: ({ children, id, ...props }) => (
    <HeadingWithAnchor variant="h5" component="h2" sx={{ mt: 4, mb: 1.5, fontWeight: 700, scrollMarginTop: '56px' }} id={id} {...props}>
      {children}
    </HeadingWithAnchor>
  ),
  h2: ({ children, id, ...props }) => (
    <HeadingWithAnchor variant="h6" component="h3" sx={{ mt: 3, mb: 1.25, position: 'sticky', top: '48px', zIndex: 2, bgcolor: 'background.default', py: 0.75, scrollMarginTop: '56px' }} id={id} {...props}>
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
        top: '90px',
        zIndex: 1,
        bgcolor: 'background.default',
        py: 0.75,
        borderBottom: 1,
        borderColor: 'divider',
        display: 'flex',
        alignItems: 'center',
        gap: 0.75,
        scrollMarginTop: '56px',
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
    const isGrid2 = classes.includes('grid2');

    const cols = isGrid2
      ? { xs: 'repeat(2, minmax(0, 1fr))', sm: 'repeat(2, minmax(0, 1fr))', md: 'repeat(2, minmax(0, 1fr))' }
      : isGrid10
      ? { xs: 'repeat(5, minmax(0, 1fr))', sm: 'repeat(5, minmax(0, 1fr))', md: 'repeat(10, minmax(0, 1fr))' }
      : { xs: 'repeat(2, minmax(0, 1fr))', sm: 'repeat(3, minmax(0, 1fr))', md: 'repeat(4, minmax(0, 1fr))' };

    return (
      <Box
        component="ul"
        sx={{
          listStyle: 'none',
          p: 0,
          m: 0,
          mb: 2,
          display: isInfostrip ? 'grid' : 'block',
          gridTemplateColumns: isInfostrip ? cols : undefined,
          rowGap: isInfostrip ? 'var(--bt-infostrip-row-gap, 0px)' : 0,
          columnGap: isInfostrip ? 0.8 : 0,
        }}
        {...props}
      >
        {children}
      </Box>
    );
  },
  li: ({ children, node, ...props }) => {
    // Old format: capt-token is inside a child <div>
    const hasDivCapt = node?.children?.some(c =>
      c.tagName === 'div' && c.children?.some(cc => cc.tagName === 'capt-token')
    );
    // New format: braille-token is a direct child of <li> (capt-token optional)
    const hasDirectBraille = !hasDivCapt && node?.children?.some(c => c.tagName === 'braille-token');
    const hasCapt = hasDivCapt || hasDirectBraille;

    if (hasDirectBraille) {
      const brailleNode = node.children.find(c => c.tagName === 'braille-token');
      const captNode    = node.children.find(c => c.tagName === 'capt-token'); // optional
      // Remaining text nodes (trimmed) become the label
      const label = node.children
        .filter(c => c.type === 'text')
        .map(c => c.value)
        .join('')
        .trim();
      return (
        <Box component="li" sx={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          gap: '6px', py: 'var(--bt-li-py, 0px)', minHeight: 'var(--bt-li-min-height, 36px)',
        }} {...props}>
          <CaptionedBrailleGrid
            brailleSpec={brailleNode?.properties?.spec || ''}
            captSpec={captNode?.properties?.spec || ''}
          />
          {label && <Box component="span" sx={{ fontSize: '0.8rem', lineHeight: 1 }}>{label}</Box>}
        </Box>
      );
    }

    return (
      <Box component="li" sx={{
        display: 'flex',
        flexDirection: hasCapt ? 'column' : 'row',
        alignItems: 'center',
        gap: hasCapt ? '6px' : 0.75,
        py: 'var(--bt-li-py, 0px)',
        minHeight: 'var(--bt-li-min-height, 36px)',
        flexWrap: hasCapt ? 'nowrap' : 'wrap',
      }} {...props}>
        {children}
      </Box>
    );
  },
  div: ({ children, node, ...props }) => {
    // Suppress whitespace-only spacer divs
    const isWhitespace = node?.children?.every(c => c.type === 'text' && !c.value?.trim());
    if (isWhitespace) return null;

    const hasCapt = node?.children?.some(c => c.tagName === 'capt-token');

    if (hasCapt) {
      const brailleNode = node.children.find(c => c.tagName === 'braille-token');
      const captNode    = node.children.find(c => c.tagName === 'capt-token');
      return (
        <CaptionedBrailleGrid
          brailleSpec={brailleNode?.properties?.spec || ''}
          captSpec={captNode?.properties?.spec || ''}
        />
      );
    }

    // Normal (non-captioned) div
    return (
      <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }} {...props}>
        {children}
      </Box>
    );
  },
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
  'capt-token': ({ node, ...props }) => {
    // Standalone use in paragraph text — interactive cells, same style as grid captions
    const spec = props.spec || node?.properties?.spec || '';
    const tokens = spec.trim().split(/\s+/).filter(Boolean);
    const BOX_W = 22; const BOX_H = 28; const BOX_GAP = 4;
    const boxSx = {
      width: BOX_W, height: BOX_H, boxSizing: 'border-box',
      border: '1px solid var(--bt-border)', borderRadius: '4px',
    };
    const innerBrailleStyle = { border: 'none', borderRadius: '2px', '--cell-dot-size': '4px', '--cell-gap': '3px', padding: '3px' };
    return (
      <Box component="span" sx={{ display: 'inline-flex', gap: `${BOX_GAP}px`, verticalAlign: 'middle' }}>
        {tokens.map((tok, i) => {
          const dotMatch = tok.match(/^dot([0-6]*)$/i);
          const isLetter = !dotMatch && /^[a-zA-Z]$/.test(tok);
          const captSpec = dotMatch ? (dotMatch[1] || '0') : tok;
          return (
            <InteractiveCellButton key={i} spec={captSpec} sx={boxSx}>
              {dotMatch
                ? <BrailleCell pattern={dotsToPattern(dotMatch[1] || '0')} size="xs" label={tok} style={innerBrailleStyle} />
                : isLetter
                ? <Box component="span" sx={{ fontFamily: 'monospace', fontSize: '0.78rem', lineHeight: 1 }}>{tok}</Box>
                : <Box component="span" sx={{ fontFamily: 'monospace', fontSize: '0.6rem', lineHeight: 1, textAlign: 'center' }}>{tok}</Box>
              }
            </InteractiveCellButton>
          );
        })}
      </Box>
    );
  },
};

// ── Page ────────────────────────────────────────────────────────────────────
export default function QuickRefPage() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const sectionParam = searchParams.get('section');
  const fullParam = searchParams.has('full');
  const isLearnRoute = location.pathname === '/learn';

  const [showExplainer, setShowExplainer] = useState(Boolean(isLearnRoute || sectionParam || fullParam));
  const { sidebarOpen } = useSiteSettings();
  const theme = useTheme();
  const isWide = useMediaQuery(theme.breakpoints.up('xl'));
  const explainerRef = useRef(null);
  const markdown = useMemo(() => transformBrailleMarkers(fullExplainerMarkdown), []);
  const contractionsNew = useMemo(() => transformBrailleMarkers(contractionsNewMarkdown), []);
  const introNew = useMemo(() => transformBrailleMarkers(introNewMarkdown), []);

  // Sync explainer visibility to route — same component mounts across /, /quickref, /learn
  useEffect(() => {
    if (isLearnRoute || sectionParam || fullParam) setShowExplainer(true);
  }, [isLearnRoute, sectionParam, fullParam]);

  const quickRef = useMemo(() => transformBrailleMarkers(QUICK_REF_MARKDOWN), []);

  return (
    <Box sx={{ px: { xs: 1, sm: 2 }, pb: 2 }}>
      <LearnNav />

      <Box sx={{ ml: isWide && sidebarOpen ? `${NAV_W}px` : 0, transition: 'margin-left 0.2s ease' }}>
        {/* ── Quick Reference Grid ── */}
        <ReactMarkdown rehypePlugins={[rehypeRaw]} components={markdownComponents}>
          {quickRef}
        </ReactMarkdown>

        {showExplainer && (
          <Box ref={explainerRef}>
            <Box sx={{ mt: 2 }}>
              <ReactMarkdown rehypePlugins={[rehypeRaw]} components={markdownComponents}>
                {introNew}
              </ReactMarkdown>
            </Box>
            <Box sx={{ mt: 2 }}>
              <ReactMarkdown rehypePlugins={[rehypeRaw]} components={markdownComponents}>
                {contractionsNew}
              </ReactMarkdown>
            </Box>
            <Box sx={{ mt: 2 }}>
              <ReactMarkdown rehypePlugins={[rehypeRaw]} components={markdownComponents}>
                {markdown}
              </ReactMarkdown>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}

import { useState } from 'react';
import {
  Box,
  Divider,
  Slider,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { dotsToPattern } from '../content';
import BrailleCell from '../lib/braille/BrailleCell';

// ── Card data ─────────────────────────────────────────────────────────────────

const SUITS = ['c', 'd', 'h', 's'];
const RANKS = ['_A', 'N2', 'N3', 'N4', 'N5', 'N6', 'N7', 'N8', 'N9', 'N10', '_J', '_Q', '_K'];

const SUIT_DOTS   = { c: '14',  d: '145', h: '125', s: '234' };
const SUIT_PRINT  = { c: '♣',  d: '♦',  h: '♥',  s: '♠'  };
const SUIT_COLORS = { h: '#cc2200', d: '#9b3a2a', s: '#0d0d0d', c: '#1e2e3d' };

const RANK_CELLS = {
  '_A':  [{ dots: '6',     print: '↑' }, { dots: '1',     print: 'A' }],
  'N2':  [{ dots: '3456',  print: '#' }, { dots: '12',    print: '2' }],
  'N3':  [{ dots: '3456',  print: '#' }, { dots: '14',    print: '3' }],
  'N4':  [{ dots: '3456',  print: '#' }, { dots: '145',   print: '4' }],
  'N5':  [{ dots: '3456',  print: '#' }, { dots: '15',    print: '5' }],
  'N6':  [{ dots: '3456',  print: '#' }, { dots: '124',   print: '6' }],
  'N7':  [{ dots: '3456',  print: '#' }, { dots: '1245',  print: '7' }],
  'N8':  [{ dots: '3456',  print: '#' }, { dots: '125',   print: '8' }],
  'N9':  [{ dots: '3456',  print: '#' }, { dots: '24',    print: '9' }],
  'N10': [{ dots: '3456',  print: '#' }, { dots: '1',     print: '1' }, { dots: '245', print: '0' }],
  '_J':  [{ dots: '6',     print: '↑' }, { dots: '245',   print: 'J' }],
  '_Q':  [{ dots: '6',     print: '↑' }, { dots: '12345', print: 'Q' }],
  '_K':  [{ dots: '6',     print: '↑' }, { dots: '13',    print: 'K' }],
};

function buildDeck() {
  const deck = [];
  for (const suit of SUITS)
    for (const rank of RANKS)
      deck.push({ suit, rank, id: `${rank}-${suit}` });
  return deck;
}
const DECK = buildDeck();

// ── Sizing ────────────────────────────────────────────────────────────────────

const CELL_METRICS = {
  xs: { dotSize: 6,  cellGap: 4,  padding: 5 },
  sm: { dotSize: 8,  cellGap: 6,  padding: 8 },
  md: { dotSize: 10, cellGap: 8,  padding: 8 },
  lg: { dotSize: 14, cellGap: 10, padding: 8 },
};

function cellWH(sz) {
  const { dotSize, cellGap, padding } = CELL_METRICS[sz];
  return {
    w: 2 * dotSize + cellGap + 2 * padding + 2,
    h: 3 * dotSize + 2 * cellGap + 2 * padding + 2,
  };
}

const CARD_PAD       = 12;
const RANK_INNER_GAP = 4;
const SCALE_SIZES    = ['xs', 'sm', 'md', 'lg'];

function getCardDims(scaleIdx) {
  const sz = SCALE_SIZES[scaleIdx];
  const m  = CELL_METRICS[sz];
  const { w: cw, h: ch } = cellWH(sz);
  const cardW = 3 * cw + 2 * RANK_INNER_GAP + 2 * CARD_PAD;
  const cardH = Math.round(cardW * 1.55);
  return { sz, cw, ch, cardW, cardH, printFontSize: ch * 0.55 };
}

// ── Back patterns ─────────────────────────────────────────────────────────────

function svgBg(svg) {
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

const BACK_PATTERNS = {
  dots: svgBg(
    `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10">` +
    `<circle cx="5" cy="5" r="1.5" fill="rgba(128,128,128,0.28)"/>` +
    `</svg>`
  ),
  braille: svgBg(
    `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="26">` +
    `<circle cx="4"  cy="5"  r="2.2" fill="rgba(128,128,128,0.22)"/>` +
    `<circle cx="14" cy="5"  r="2.2" fill="rgba(128,128,128,0.22)"/>` +
    `<circle cx="4"  cy="13" r="2.2" fill="rgba(128,128,128,0.22)"/>` +
    `<circle cx="14" cy="13" r="2.2" fill="rgba(128,128,128,0.22)"/>` +
    `<circle cx="4"  cy="21" r="2.2" fill="rgba(128,128,128,0.22)"/>` +
    `<circle cx="14" cy="21" r="2.2" fill="rgba(128,128,128,0.22)"/>` +
    `</svg>`
  ),
  sparse: svgBg(
    `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28">` +
    `<circle cx="14" cy="14" r="4" fill="rgba(128,128,128,0.18)"/>` +
    `</svg>`
  ),
  rings: svgBg(
    `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20">` +
    `<circle cx="10" cy="10" r="7" fill="none" stroke="rgba(128,128,128,0.25)" stroke-width="1.5"/>` +
    `</svg>`
  ),
};

// ── CellWithPrint ─────────────────────────────────────────────────────────────

function CellWithPrint({ dots, printChar, sz, dotColor, emptyDotColor, showPrint, showBounds, printFontSize }) {
  const cellStyle = {
    '--cell-dot-color':       dotColor,
    '--cell-dot-empty-color': emptyDotColor,
    '--cell-border-color':    showBounds ? 'rgba(128,128,128,0.4)' : 'transparent',
  };
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex', flexShrink: 0 }}>
      <Box sx={{ opacity: showPrint ? 0.12 : 1, display: 'inline-flex' }}>
        <BrailleCell pattern={dotsToPattern(dots)} size={sz} label={printChar} style={cellStyle} />
      </Box>
      {showPrint && (
        <Box sx={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
          fontFamily: '"Courier New", Courier, monospace',
          fontSize: printFontSize,
          fontWeight: 700,
          color: dotColor,
          lineHeight: 1,
        }}>
          {printChar}
        </Box>
      )}
    </Box>
  );
}

// ── CardFace ──────────────────────────────────────────────────────────────────

function CardFace({ suit, rank, suitColor, showBounds, showPrint, showOutline, emptyDotColor, dims }) {
  const { sz, cardW, cardH, printFontSize } = dims;
  const dotColor = suitColor ? SUIT_COLORS[suit] : 'var(--bt-ink)';

  const cellProps = { sz, dotColor, emptyDotColor, showPrint, showBounds, printFontSize };

  return (
    <Box sx={{
      width:  cardW,
      height: cardH,
      border: '1.5px solid',
      borderColor: showOutline ? 'divider' : 'transparent',
      borderRadius: '8px',
      bgcolor: 'background.paper',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      padding: `${CARD_PAD}px`,
      flexShrink: 0,
      boxSizing: 'border-box',
    }}>
      {/* Rank — top */}
      <Box sx={{ display: 'flex', gap: `${RANK_INNER_GAP}px` }}>
        {RANK_CELLS[rank].map((cell, i) => (
          <CellWithPrint key={i} dots={cell.dots} printChar={cell.print} {...cellProps} />
        ))}
      </Box>
      {/* Suit — bottom */}
      <CellWithPrint dots={SUIT_DOTS[suit]} printChar={SUIT_PRINT[suit]} {...cellProps} />
    </Box>
  );
}

// ── CardBack ──────────────────────────────────────────────────────────────────

function CardBack({ pattern, showOutline, dims }) {
  const { cardW, cardH } = dims;
  return (
    <Box sx={{
      width: cardW,
      height: cardH,
      border: '1.5px solid',
      borderColor: showOutline ? 'divider' : 'transparent',
      borderRadius: '8px',
      bgcolor: 'background.paper',
      backgroundImage: pattern,
      flexShrink: 0,
    }} />
  );
}

// ── Card ──────────────────────────────────────────────────────────────────────

function Card({ suit, rank, suitColor, cardOutline, cellBounds, brailleDots, printOverlay, unraisedDots, pattern, dims }) {
  const [hovered, setHovered] = useState(false);

  const showOutline  = cardOutline === 'always' || (cardOutline === 'hover' && hovered);
  const showBounds   = cellBounds  === 'always' || (cellBounds  === 'hover' && hovered);
  const showDots     = brailleDots === 'always' || (brailleDots === 'hover' && hovered);
  const showPrint    = printOverlay === 'hover' && hovered;

  const emptyDotColor =
    unraisedDots === 'always' ? 'rgba(128,128,128,0.3)'
    : unraisedDots === 'hover' && hovered ? 'rgba(128,128,128,0.3)'
    : 'transparent';

  return (
    <Box
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{ cursor: 'default', userSelect: 'none', display: 'inline-flex' }}
    >
      {showDots
        ? <CardFace suit={suit} rank={rank} suitColor={suitColor} showBounds={showBounds} showPrint={showPrint} showOutline={showOutline} emptyDotColor={emptyDotColor} dims={dims} />
        : <CardBack pattern={pattern} showOutline={showOutline} dims={dims} />
      }
    </Box>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

function Setting({ label, children }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
      <Typography variant="caption">{label}</Typography>
      {children}
    </Box>
  );
}

export default function SolitairePage() {
  const save = (key, val) => { try { localStorage.setItem(key, val); } catch {} };
  const load = (key, def) => { try { return localStorage.getItem(key) ?? def; } catch { return def; } };

  const [cardOutline,  setCardOutline]  = useState(() => load('bt-sol-outline',  'always'));
  const [cellBounds,   setCellBounds]   = useState(() => load('bt-sol-bounds',   'never'));
  const [brailleDots,  setBrailleDots]  = useState(() => load('bt-sol-dots',     'always'));
  const [printOverlay, setPrintOverlay] = useState(() => load('bt-sol-print',    'never'));
  const [unraisedDots, setUnraisedDots] = useState(() => load('bt-sol-unraised', 'never'));
  const [suitColor,    setSuitColor]    = useState(() => load('bt-sol-suit',     'off'));
  const [pattern,      setPattern]      = useState(() => load('bt-sol-pattern',  'braille'));
  const [scale,        setScale]        = useState(() => Number(load('bt-sol-scale', '1')));
  const [layout,       setLayout]       = useState(() => load('bt-sol-layout', 'wrap'));

  const dims = getCardDims(scale);

  const handle = (setter, key) => (_, v) => {
    if (v === null || v === undefined) return;
    setter(v); save(key, v);
  };

  const sharedCardProps = {
    suitColor: suitColor === 'on',
    cardOutline, cellBounds, brailleDots, printOverlay, unraisedDots,
    pattern: BACK_PATTERNS[pattern],
    dims,
  };

  const SUIT_LABELS = { c: 'Clubs ♣', d: 'Diamonds ♦', h: 'Hearts ♥', s: 'Spades ♠' };

  return (
    <Box sx={{ pb: 4 }}>
      <Typography variant="h5" component="h1" sx={{ mb: 0.5 }}>Braille Solitaire</Typography>
      <Typography variant="body2" sx={{ mb: 2, opacity: 0.7 }}>A standard 52-card deck in braille notation.</Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'flex-end', mb: 2 }}>

        <Setting label="Card outline">
          <ToggleButtonGroup exclusive size="small" value={cardOutline} onChange={handle(setCardOutline, 'bt-sol-outline')}>
            <ToggleButton value="never">Never</ToggleButton>
            <ToggleButton value="hover">Hover</ToggleButton>
            <ToggleButton value="always">Always</ToggleButton>
          </ToggleButtonGroup>
        </Setting>

        <Setting label="Cell bounds">
          <ToggleButtonGroup exclusive size="small" value={cellBounds} onChange={handle(setCellBounds, 'bt-sol-bounds')}>
            <ToggleButton value="never">Never</ToggleButton>
            <ToggleButton value="hover">Hover</ToggleButton>
            <ToggleButton value="always">Always</ToggleButton>
          </ToggleButtonGroup>
        </Setting>

        <Setting label="Braille dots">
          <ToggleButtonGroup exclusive size="small" value={brailleDots} onChange={handle(setBrailleDots, 'bt-sol-dots')}>
            <ToggleButton value="hover">Hover</ToggleButton>
            <ToggleButton value="always">Always</ToggleButton>
          </ToggleButtonGroup>
        </Setting>

        <Setting label="Unraised dots">
          <ToggleButtonGroup exclusive size="small" value={unraisedDots} onChange={handle(setUnraisedDots, 'bt-sol-unraised')}>
            <ToggleButton value="never">Never</ToggleButton>
            <ToggleButton value="hover">Hover</ToggleButton>
            <ToggleButton value="always">Always</ToggleButton>
          </ToggleButtonGroup>
        </Setting>

        <Setting label="Print overlay">
          <ToggleButtonGroup exclusive size="small" value={printOverlay} onChange={handle(setPrintOverlay, 'bt-sol-print')}>
            <ToggleButton value="never">Never</ToggleButton>
            <ToggleButton value="hover">Hover</ToggleButton>
          </ToggleButtonGroup>
        </Setting>

        <Setting label="Suit color">
          <ToggleButtonGroup exclusive size="small" value={suitColor} onChange={handle(setSuitColor, 'bt-sol-suit')}>
            <ToggleButton value="off">Off</ToggleButton>
            <ToggleButton value="on">On</ToggleButton>
          </ToggleButtonGroup>
        </Setting>

        <Setting label="Back pattern">
          <ToggleButtonGroup exclusive size="small" value={pattern} onChange={handle(setPattern, 'bt-sol-pattern')}>
            <ToggleButton value="dots">Dots</ToggleButton>
            <ToggleButton value="braille">Braille</ToggleButton>
            <ToggleButton value="sparse">Sparse</ToggleButton>
            <ToggleButton value="rings">Rings</ToggleButton>
          </ToggleButtonGroup>
        </Setting>

        <Setting label="Card size">
          <Box sx={{ px: 0.5, minWidth: 110 }}>
            <Slider size="small" min={0} max={3} step={1} marks value={scale}
              onChange={(_, v) => { setScale(v); save('bt-sol-scale', v); }}
              aria-label="Card size" />
          </Box>
        </Setting>

        <Setting label="Layout">
          <ToggleButtonGroup exclusive size="small" value={layout} onChange={handle(setLayout, 'bt-sol-layout')}>
            <ToggleButton value="wrap">Wrap</ToggleButton>
            <ToggleButton value="suits">By suit</ToggleButton>
          </ToggleButtonGroup>
        </Setting>

      </Box>

      <Divider sx={{ mb: 2 }} />

      {layout === 'wrap' ? (
        <Box sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1,
        }}>
          {DECK.map((card) => (
            <Card key={card.id} suit={card.suit} rank={card.rank} {...sharedCardProps} />
          ))}
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {SUITS.map((suit) => (
            <Box key={suit}>
              <Typography variant="caption" sx={{ opacity: 0.6, mb: 0.5, display: 'block' }}>
                {SUIT_LABELS[suit]}
              </Typography>
              <Box sx={{ overflowX: 'auto', pb: 0.5 }}>
                <Box sx={{ display: 'flex', gap: 1, width: 'max-content' }}>
                  {RANKS.map((rank) => (
                    <Card key={`${rank}-${suit}`} suit={suit} rank={rank} {...sharedCardProps} />
                  ))}
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}

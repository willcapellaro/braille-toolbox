import { useEffect, useReducer, useState } from 'react';
import { Box, Button, Collapse, Divider, Typography, useTheme } from '@mui/material';
import { dotsToPattern } from '../content';
import BrailleCell from '../lib/braille/BrailleCell';
import { useSolitaireSettings } from '../context/SolitaireSettingsContext.jsx';
import { useSiteSettings } from '../App.jsx';

function hexLum(hex) {
  if (!hex || !hex.startsWith('#')) return 1;
  const r = parseInt(hex.slice(1,3),16)/255, g = parseInt(hex.slice(3,5),16)/255, b = parseInt(hex.slice(5,7),16)/255;
  return 0.299*r + 0.587*g + 0.114*b;
}

// ── Card data ─────────────────────────────────────────────────────────────────

const SUITS   = ['c', 'd', 'h', 's'];
const RANKS   = ['_A', 'N2', 'N3', 'N4', 'N5', 'N6', 'N7', 'N8', 'N9', 'N10', '_J', '_Q', '_K'];
const RANK_VAL = Object.fromEntries(RANKS.map((r, i) => [r, i]));

const SUIT_DOTS  = { c: '14',  d: '145', h: '125', s: '234' };
const SUIT_PRINT = { c: '♣',  d: '♦',  h: '♥',  s: '♠'  };
const SUIT_COLOR = { h: '#cc2200', d: '#9b3a2a', s: '#0d0d0d', c: '#1e2e3d' };
const SUIT_RED   = new Set(['h', 'd']);

const RANK_CELLS = {
  '_A':  [{ dots: '6', print: '↑' }, { dots: '1',     print: 'A' }],
  'N2':  [{ dots: '3456', print: '#' }, { dots: '12',    print: '2' }],
  'N3':  [{ dots: '3456', print: '#' }, { dots: '14',    print: '3' }],
  'N4':  [{ dots: '3456', print: '#' }, { dots: '145',   print: '4' }],
  'N5':  [{ dots: '3456', print: '#' }, { dots: '15',    print: '5' }],
  'N6':  [{ dots: '3456', print: '#' }, { dots: '124',   print: '6' }],
  'N7':  [{ dots: '3456', print: '#' }, { dots: '1245',  print: '7' }],
  'N8':  [{ dots: '3456', print: '#' }, { dots: '125',   print: '8' }],
  'N9':  [{ dots: '3456', print: '#' }, { dots: '24',    print: '9' }],
  'N10': [{ dots: '3456', print: '#' }, { dots: '1',     print: '1' }, { dots: '245', print: '0' }],
  '_J':  [{ dots: '6', print: '↑' }, { dots: '245',   print: 'J' }],
  '_Q':  [{ dots: '6', print: '↑' }, { dots: '12345', print: 'Q' }],
  '_K':  [{ dots: '6', print: '↑' }, { dots: '13',    print: 'K' }],
};

// Braille letter/number orthography lookup
const DOTS_TO_ORTHO = {
  '1': 'A/1', '12': 'B/2', '14': 'C/3', '145': 'D/4', '15': 'E/5',
  '124': 'F/6', '1245': 'G/7', '125': 'H/8', '24': 'I/9', '245': 'J/0',
  '13': 'K', '123': 'L', '134': 'M', '1345': 'N', '135': 'O',
  '1234': 'P', '12345': 'Q', '1235': 'R', '234': 'S', '2345': 'T',
  '136': 'U', '1236': 'V', '2456': 'W', '1346': 'X', '13456': 'Y', '1356': 'Z',
  '6': '^', '3456': '#',
};

function buildDeck() {
  const deck = [];
  let id = 0;
  for (const suit of SUITS)
    for (const rank of RANKS)
      deck.push({ suit, rank, id: id++ });
  return deck;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── Rules ─────────────────────────────────────────────────────────────────────

function canPlaceOnTableau(card, target) {
  // target is the top card of a column, or null (empty column accepts only K)
  if (!target) return card.rank === '_K';
  return SUIT_RED.has(card.suit) !== SUIT_RED.has(target.suit)
      && RANK_VAL[card.rank] === RANK_VAL[target.rank] - 1;
}

function canPlaceOnFoundation(card, pile) {
  if (pile.length === 0) return card.rank === '_A';
  const top = pile[pile.length - 1];
  return card.suit === top.suit && RANK_VAL[card.rank] === RANK_VAL[top.rank] + 1;
}

// ── Initial state ─────────────────────────────────────────────────────────────

function deal() {
  const deck = shuffle(buildDeck());
  const tableau = Array.from({ length: 7 }, () => []);
  let i = 0;
  for (let col = 0; col < 7; col++) {
    for (let row = 0; row <= col; row++) {
      tableau[col].push({ ...deck[i++], faceUp: row === col });
    }
  }
  return {
    stock:       deck.slice(i).map(c => ({ ...c, faceUp: false })),
    waste:       [],
    foundations: [[], [], [], []],
    tableau,
    selected:    null, // { source, cards }
  };
}

// ── Reducer ───────────────────────────────────────────────────────────────────

function reducer(state, action) {
  switch (action.type) {

    case 'DRAW': {
      if (state.stock.length === 0) {
        // Flip waste back to stock
        return {
          ...state,
          stock: [...state.waste].reverse().map(c => ({ ...c, faceUp: false })),
          waste: [],
          selected: null,
        };
      }
      const card = { ...state.stock[state.stock.length - 1], faceUp: true };
      return {
        ...state,
        stock: state.stock.slice(0, -1),
        waste: [...state.waste, card],
        selected: null,
      };
    }

    case 'SELECT_WASTE': {
      if (state.waste.length === 0) return state;
      const card = state.waste[state.waste.length - 1];
      return { ...state, selected: { source: 'waste', cards: [card] } };
    }

    case 'SELECT_TABLEAU': {
      const { col, idx } = action;
      const column = state.tableau[col];

      // If something is selected, try to move it here first (handles empty columns too)
      if (state.selected) {
        const target = column.length > 0 ? column[column.length - 1] : null;
        const movingCard = state.selected.cards[0];
        if (canPlaceOnTableau(movingCard, target)) {
          const newTableau = state.tableau.map(c => [...c]);
          // Remove from source
          if (state.selected.source === 'waste') {
            const newWaste = state.waste.slice(0, -1);
            newTableau[col] = [...newTableau[col], ...state.selected.cards];
            return { ...state, waste: newWaste, tableau: newTableau, selected: null };
          } else {
            const { col: fromCol, idx: fromIdx } = state.selected;
            const moving = newTableau[fromCol].splice(fromIdx);
            if (newTableau[fromCol].length > 0) {
              newTableau[fromCol][newTableau[fromCol].length - 1].faceUp = true;
            }
            newTableau[col] = [...newTableau[col], ...moving];
            return { ...state, tableau: newTableau, selected: null };
          }
        }
        // Can't move here — deselect
        return { ...state, selected: null };
      }

      // Nothing selected — try to select the clicked card
      const card = column[idx];
      if (!card || !card.faceUp) return state;

      // Deselect if clicking the already-selected card
      if (state.selected?.source === 'tableau' &&
          state.selected?.col === col && state.selected?.idx === idx) {
        return { ...state, selected: null };
      }

      const cards = column.slice(idx);
      return { ...state, selected: { source: 'tableau', col, idx, cards } };
    }

    case 'SELECT_FOUNDATION': {
      const { pile } = action;
      if (state.selected) {
        const foundation = state.foundations.map(f => [...f]);
        const movingCards = state.selected.cards;
        if (movingCards.length === 1 && canPlaceOnFoundation(movingCards[0], foundation[pile])) {
          foundation[pile] = [...foundation[pile], movingCards[0]];
          if (state.selected.source === 'waste') {
            return { ...state, waste: state.waste.slice(0, -1), foundations: foundation, selected: null };
          } else {
            const newTableau = state.tableau.map(c => [...c]);
            const { col: fromCol } = state.selected;
            newTableau[fromCol] = newTableau[fromCol].slice(0, -1);
            if (newTableau[fromCol].length > 0) {
              newTableau[fromCol][newTableau[fromCol].length - 1].faceUp = true;
            }
            return { ...state, tableau: newTableau, foundations: foundation, selected: null };
          }
        }
      }
      return { ...state, selected: null };
    }

    case 'FLIP_TABLEAU': {
      const newTableau = state.tableau.map(c => [...c]);
      const col = newTableau[action.col];
      if (col.length > 0 && !col[col.length - 1].faceUp) {
        col[col.length - 1] = { ...col[col.length - 1], faceUp: true };
      }
      return { ...state, tableau: newTableau, selected: null };
    }

    case 'DESELECT':
      return { ...state, selected: null };

    case 'DEAL':
      return deal();

    case 'LOAD':
      return { ...action.state, selected: null };

    default:
      return state;
  }
}

// ── Sizing ────────────────────────────────────────────────────────────────────

const CELL_SZ    = 'xs';
const CELL_M     = { dotSize: 6, cellGap: 4, padding: 5 };
const CELL_W     = 2 * CELL_M.dotSize + CELL_M.cellGap + 2 * CELL_M.padding + 2; // 28
const CARD_PAD   = 6;
const CELL_GAP   = 3;
const CARD_W     = 3 * CELL_W + 2 * CELL_GAP + 2 * CARD_PAD;  // 3×28 + 2×3 + 2×6 = 102
const CARD_H     = Math.round(CARD_W * 1.55);                  // ~158
const STACK_PEEK = 18; // px each face-down card peeks below the one above it
const FACE_PEEK  = 28; // px each face-up card peeks

// ── Cell with optional print overlay ─────────────────────────────────────────

function CellWithPrint({ cell, dotColor, showPrintOverlay, printStyle }) {
  const label = showPrintOverlay
    ? (printStyle === 'ortho' ? (DOTS_TO_ORTHO[cell.dots] ?? cell.print) : cell.print)
    : null;
  const isSlash = label?.includes('/');

  return (
    <Box sx={{ position: 'relative', display: 'inline-flex', flexShrink: 0 }}>
      <BrailleCell
        pattern={dotsToPattern(cell.dots)}
        size={CELL_SZ}
        label={cell.print}
        style={{ '--cell-dot-color': dotColor }}
      />
      {label !== null && (
        <Box
          component="span"
          className="card-print-label"
          sx={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            lineHeight: 1, fontFamily: 'monospace', fontWeight: 'bold',
            fontSize: isSlash ? '9px' : '13px',
            color: dotColor, pointerEvents: 'none', userSelect: 'none',
          }}
        >
          {isSlash ? label.split('/').map((part, i) => <span key={i}>{part}</span>) : label}
        </Box>
      )}
    </Box>
  );
}

// ── Card rendering ────────────────────────────────────────────────────────────

function PlayingCard({ card, selected, onClick, faceDown, sol, isValidTarget, legendHighlighted, onCardHover, darkBg }) {
  if (faceDown || !card.faceUp) {
    return (
      <Box onClick={onClick} sx={{
        width: CARD_W, height: CARD_H,
        border: '1.5px solid', borderColor: 'divider',
        borderRadius: '6px', bgcolor: 'background.paper',
        backgroundImage: `url('/patterns/klondike.svg')`,
        backgroundSize: '20% 20%',
        cursor: 'pointer', flexShrink: 0,
      }} />
    );
  }

  const dotColor = sol?.suitColor === 'on' ? SUIT_COLOR[card.suit] : 'var(--bt-ink)';
  const showPrintOverlay = sol?.printOverlay === 'hover' || sol?.printOverlay === 'always';
  const printStyle = sol?.printStyle ?? 'exact';

  // On dark bg, add a crisp 1.5px white ring around raised dots for contrast
  const dotOutlineSx = darkBg ? { '& .braille-dot.is-raised': { boxShadow: '0 0 0 1.5px #ffffff' } } : {};

  // Card outline sx
  const outlineSx = !selected
    ? sol?.cardOutline === 'never'
      ? { borderColor: 'transparent' }
      : sol?.cardOutline === 'hover'
      ? { borderColor: 'transparent', '&:hover': { borderColor: 'divider' } }
      : {}  // 'always' — keep default
    : {};

  // Cell bounds sx (default .braille-cell uses var(--bt-border); we control from here)
  const boundsSx =
    sol?.cellBounds === 'always' ? { '& .braille-cell': { '--cell-border-color': 'var(--bt-border)' } } :
    sol?.cellBounds === 'hover'  ? { '& .braille-cell': { '--cell-border-color': 'transparent' }, '&:hover .braille-cell': { '--cell-border-color': 'var(--bt-border)' } } :
    /* never */                    { '& .braille-cell': { '--cell-border-color': 'transparent' } };

  // Dot visibility sx
  const dotsSx = sol?.brailleDots === 'hover'
    ? { '& .braille-dot.is-raised': { opacity: 0, transition: 'opacity 0.12s' }, '&:hover .braille-dot.is-raised': { opacity: 1 } }
    : {};

  // Unraised dots sx
  const unraisedSx =
    sol?.unraisedDots === 'never' ? { '& .braille-dot.is-flat': { opacity: 0 } } :
    sol?.unraisedDots === 'hover' ? { '& .braille-dot.is-flat': { opacity: 0, transition: 'opacity 0.12s' }, '&:hover .braille-dot.is-flat': { opacity: 1 } } :
    {};

  // Print overlay — crossfades dots out as label fades in
  const printSx =
    sol?.printOverlay === 'hover' ? {
      '& .card-print-label':              { opacity: 0, transition: 'opacity 0.15s' },
      '&:hover .card-print-label':        { opacity: 1 },
      '& .braille-dot.is-raised':         { transition: 'opacity 0.15s' },
      '&:hover .braille-dot.is-raised':   { opacity: 0 },
    } :
    sol?.printOverlay === 'always' ? {
      '& .braille-dot.is-raised':         { opacity: 0.15 },
    } : {};

  const validTargetSx = isValidTarget ? {
    '&:hover': { outline: '2px dashed', outlineColor: '#4caf50', outlineOffset: '2px' },
  } : {};

  const legendHiSx = legendHighlighted ? { boxShadow: '0 0 0 2.5px var(--bt-ink)' } : {};

  return (
    <Box
      onClick={onClick}
      onMouseEnter={onCardHover ? () => onCardHover({ suit: card.suit, rank: card.rank }) : undefined}
      onMouseLeave={onCardHover ? () => onCardHover(null) : undefined}
      sx={{
        width: CARD_W, height: CARD_H,
        border: '1.5px solid',
        borderColor: selected ? 'primary.main' : 'divider',
        borderRadius: '6px',
        bgcolor: sol?.cardBg === 'white' ? '#ffffff' : (selected ? 'action.selected' : 'background.paper'),
        outline: selected ? '2px solid' : 'none',
        outlineColor: 'primary.main',
        outlineOffset: '1px',
        display: 'flex', flexDirection: 'column',
        alignItems: 'flex-start', justifyContent: 'space-between',
        padding: `${CARD_PAD}px`, boxSizing: 'border-box',
        cursor: 'pointer', flexShrink: 0,
        transition: 'border-color 0.1s, outline 0.1s, box-shadow 0.1s',
        ...outlineSx, ...boundsSx, ...dotsSx, ...unraisedSx, ...printSx, ...validTargetSx, ...legendHiSx, ...dotOutlineSx,
      }}>
      {/* Rank — top */}
      <Box sx={{ display: 'flex', gap: `${CELL_GAP}px` }}>
        {RANK_CELLS[card.rank].map((cell, i) => (
          <CellWithPrint key={i} cell={cell} dotColor={dotColor} showPrintOverlay={showPrintOverlay} printStyle={printStyle} />
        ))}
      </Box>
      {/* Suit — bottom */}
      <CellWithPrint
        cell={{ dots: SUIT_DOTS[card.suit], print: SUIT_PRINT[card.suit] }}
        dotColor={dotColor}
        showPrintOverlay={showPrintOverlay}
        printStyle={printStyle}
      />
    </Box>
  );
}

// EmptySlot shows a braille cell for the suit hint, or nothing.
// suitDots: dot string to show (e.g. '14' for clubs), or null for blank.
function EmptySlot({ onClick, suitDots, isValidTarget }) {
  const dimStyle = { '--cell-dot-color': 'var(--bt-ink)', '--cell-border-color': 'transparent', opacity: 0.2 };
  return (
    <Box onClick={onClick} sx={{
      width: CARD_W, height: CARD_H,
      border: '1.5px dashed', borderColor: 'divider',
      borderRadius: '6px', flexShrink: 0,
      display: 'flex', flexDirection: 'column',
      alignItems: 'flex-start', justifyContent: 'flex-end',
      padding: `${CARD_PAD}px`, boxSizing: 'border-box',
      cursor: onClick ? 'pointer' : 'default',
      ...(isValidTarget && { '&:hover': { outline: '2px dashed', outlineColor: '#4caf50', outlineOffset: '2px' } }),
    }}>
      {suitDots && (
        <BrailleCell pattern={dotsToPattern(suitDots)} size={CELL_SZ} label="" style={dimStyle} />
      )}
    </Box>
  );
}

// ── Tableau column ────────────────────────────────────────────────────────────

function TableauColumn({ cards, col, selected, dispatch, sol, isValidTarget, lgSuit, lgRank, onCardHover, darkBg }) {
  const [elevatedIdx, setElevatedIdx] = useState(null);
  const selectedSrc = selected?.source === 'tableau' && selected?.col === col;

  const colHeight = cards.length === 0
    ? CARD_H
    : cards.slice(0, -1).reduce((acc, c) => acc + (c.faceUp ? FACE_PEEK : STACK_PEEK), 0) + CARD_H;

  const handleMouseMove = (e) => {
    // Disable peek elevation while a card is selected
    if (selected) { setElevatedIdx(null); return; }
    const y = e.clientY - e.currentTarget.getBoundingClientRect().top;
    let cumY = 0;
    for (let i = 0; i < cards.length - 1; i++) {
      const peek = cards[i].faceUp ? FACE_PEEK : STACK_PEEK;
      if (y >= cumY && y < cumY + peek) {
        setElevatedIdx(cards[i].faceUp ? i : null);
        return;
      }
      cumY += peek;
    }
    setElevatedIdx(null);
  };

  return (
    <Box
      sx={{ position: 'relative', width: CARD_W, height: colHeight, flexShrink: 0 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setElevatedIdx(null)}
    >
      {cards.length === 0 ? (
        <EmptySlot
          isValidTarget={isValidTarget}
          onClick={() => dispatch({ type: 'SELECT_TABLEAU', col, idx: 0 })}
        />
      ) : (
        cards.map((card, idx) => {
          const offsetY = cards.slice(0, idx).reduce((acc, c) => {
            return acc + (c.faceUp ? FACE_PEEK : STACK_PEEK);
          }, 0);
          const isInSelection = selectedSrc && idx >= selected.idx;
          const isElevated = idx === elevatedIdx && !selected;
          const isTop = idx === cards.length - 1;
          return (
            <Box key={card.id} sx={{ position: 'absolute', top: offsetY, left: 0, zIndex: isElevated ? 200 : idx }}>
              <PlayingCard
                card={card}
                selected={isInSelection}
                sol={sol}
                isValidTarget={isTop ? isValidTarget : false}
                legendHighlighted={card.faceUp && ((lgSuit && card.suit === lgSuit) || (lgRank && card.rank === lgRank))}
                onCardHover={onCardHover}
                darkBg={darkBg}
                onClick={() => {
                  if (!card.faceUp) dispatch({ type: 'FLIP_TABLEAU', col });
                  else dispatch({ type: 'SELECT_TABLEAU', col, idx });
                }}
              />
            </Box>
          );
        })
      )}
    </Box>
  );
}

// ── Win check ─────────────────────────────────────────────────────────────────

function isWon(foundations) {
  return foundations.every(f => f.length === 13);
}

// ── Page ──────────────────────────────────────────────────────────────────────

// ── Legend ────────────────────────────────────────────────────────────────────

const SUIT_LETTER = { c: 'C', d: 'D', h: 'H', s: 'S' };

const CAP_ITEMS = [
  { rank: '_A',  dots: '1',     caption: 'A 1' },
  { rank: '_J',  dots: '245',   caption: 'J 0' },
  { rank: '_Q',  dots: '12345', caption: 'Q' },
  { rank: '_K',  dots: '13',    caption: 'K' },
];

// Ordered 10→2 for vertical (top=10), reversed for horizontal (left=2)
const NUM_ITEMS = [
  { rank: 'N10', ten: true },
  { rank: 'N9',  dots: '24',   caption: 'I 9' },
  { rank: 'N8',  dots: '125',  caption: 'H 8' },
  { rank: 'N7',  dots: '1245', caption: 'G 7' },
  { rank: 'N6',  dots: '124',  caption: 'F 6' },
  { rank: 'N5',  dots: '15',   caption: 'E 5' },
  { rank: 'N4',  dots: '145',  caption: 'D 4' },
  { rank: 'N3',  dots: '14',   caption: 'C 3' },
  { rank: 'N2',  dots: '12',   caption: 'B 2' },
];

const LCELL_SX = (hi, dimmed, darkBg) => ({
  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.25,
  p: '2px', borderRadius: '4px',
  bgcolor: hi ? 'action.selected' : 'transparent',
  outline: '1.5px solid', outlineColor: hi ? 'primary.main' : 'transparent',
  opacity: dimmed ? 0.2 : 1,
  transition: 'background-color 0.12s, outline-color 0.12s, opacity 0.12s',
  ...(darkBg && { '& .braille-dot.is-raised': { boxShadow: '0 0 0 1.5px #ffffff' } }),
});

function LegendCellItem({ dots, caption, color, highlighted, dimmed, darkBg, hoverProps }) {
  return (
    <Box {...hoverProps} sx={{ ...LCELL_SX(highlighted, dimmed, darkBg), cursor: hoverProps?.onMouseEnter ? 'crosshair' : 'default' }}>
      <BrailleCell pattern={dotsToPattern(dots)} size={CELL_SZ} label={caption}
        style={{ '--cell-dot-color': color }} />
      <Typography variant="caption" sx={{ fontSize: '9px', opacity: 0.5, lineHeight: 1, whiteSpace: 'nowrap' }}>
        {caption}
      </Typography>
    </Box>
  );
}

function LegendPrefixItem({ dots, caption }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.25, opacity: 0.4 }}>
      <BrailleCell pattern={dotsToPattern(dots)} size={CELL_SZ} label={caption}
        style={{ '--cell-dot-color': 'var(--bt-ink)' }} />
      <Typography variant="caption" sx={{ fontSize: '9px', lineHeight: 1, whiteSpace: 'nowrap' }}>{caption}</Typography>
    </Box>
  );
}

function LegendTenItem({ highlighted, dimmed, darkBg, hoverProps, color }) {
  return (
    <Box {...hoverProps} sx={{ ...LCELL_SX(highlighted, dimmed, darkBg), cursor: hoverProps?.onMouseEnter ? 'crosshair' : 'default' }}>
      <Box sx={{ display: 'flex', gap: 0, borderRadius: '3px', overflow: 'hidden' }}>
        <BrailleCell pattern={dotsToPattern('1')}   size={CELL_SZ} label="1" style={{ '--cell-dot-color': color }} />
        <BrailleCell pattern={dotsToPattern('245')} size={CELL_SZ} label="0" style={{ '--cell-dot-color': color }} />
      </Box>
      <Box sx={{ display: 'flex' }}>
        <Typography variant="caption" sx={{ fontSize: '9px', opacity: 0.5, lineHeight: 1, width: CELL_W, textAlign: 'center' }}>A 1</Typography>
        <Typography variant="caption" sx={{ fontSize: '9px', opacity: 0.5, lineHeight: 1, width: CELL_W, textAlign: 'center' }}>J 0</Typography>
      </Box>
    </Box>
  );
}

function Legend({ sol, visibleSuits, visibleRanks, hoveredCardSig, onHoverKey, darkBg }) {
  const highlightOn = sol?.legendHighlight === 'on';
  const hoverOn     = sol?.legendHover === 'on';
  const vertical    = sol?.legendPosition === 'right';
  const ink = 'var(--bt-ink)';

  const suitDotColor = (s) => sol?.suitColor === 'on' ? SUIT_COLOR[s] : ink;

  const isHi = (type, val) => {
    const fromVis  = highlightOn && (type === 'suit' ? visibleSuits.has(val) : visibleRanks.has(val));
    const fromCard = hoverOn && hoveredCardSig && (type === 'suit' ? hoveredCardSig.suit === val : hoveredCardSig.rank === val);
    return fromVis || fromCard;
  };

  // Any cell highlighted? If so, non-highlighted cells dim.
  const anyHi = (highlightOn && (visibleSuits.size > 0 || visibleRanks.size > 0))
    || (hoverOn && hoveredCardSig != null);

  const hp = (key) => hoverOn
    ? { onMouseEnter: () => onHoverKey(key), onMouseLeave: () => onHoverKey(null) }
    : {};

  const suitEls = SUITS.map(s => {
    const hi = isHi('suit', s);
    return <LegendCellItem key={s} dots={SUIT_DOTS[s]} caption={`${SUIT_LETTER[s]} ${SUIT_PRINT[s]}`}
      color={suitDotColor(s)} highlighted={hi} dimmed={anyHi && !hi} darkBg={darkBg} hoverProps={hp('suit:' + s)} />;
  });

  const capEls = CAP_ITEMS.map(({ rank, dots, caption }) => {
    const hi = isHi('rank', rank);
    return <LegendCellItem key={rank} dots={dots} caption={caption}
      color={ink} highlighted={hi} dimmed={anyHi && !hi} darkBg={darkBg} hoverProps={hp('rank:' + rank)} />;
  });

  const numOrder = vertical ? NUM_ITEMS : [...NUM_ITEMS].reverse();
  const numEls = numOrder.map(({ rank, ten, dots, caption }) => {
    const hi = isHi('rank', rank);
    return ten
      ? <LegendTenItem key={rank} highlighted={hi} dimmed={anyHi && !hi} darkBg={darkBg} color={ink} hoverProps={hp('rank:' + rank)} />
      : <LegendCellItem key={rank} dots={dots} caption={caption} color={ink} highlighted={hi} dimmed={anyHi && !hi} darkBg={darkBg} hoverProps={hp('rank:' + rank)} />;
  });

  if (vertical) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, pl: 1.5, borderLeft: '1px solid', borderColor: 'divider', flexShrink: 0 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>{suitEls}</Box>
        <Divider />
        <LegendPrefixItem dots="6" caption="^ cap" />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>{capEls}</Box>
        <Divider />
        <LegendPrefixItem dots="3456" caption="# num" />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>{numEls}</Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 0.25, overflowX: 'auto', pb: 0.5, mb: 1 }}>
      <Box sx={{ display: 'flex', gap: 0.25, alignItems: 'flex-end' }}>{suitEls}</Box>
      <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
      <Box sx={{ display: 'flex', gap: 0.25, alignItems: 'flex-end' }}>
        <LegendPrefixItem dots="6" caption="^ cap" />
        <Typography variant="caption" sx={{ opacity: 0.3, pb: '4px', flexShrink: 0 }}>+</Typography>
        {capEls}
      </Box>
      <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
      <Box sx={{ display: 'flex', gap: 0.25, alignItems: 'flex-end' }}>
        <LegendPrefixItem dots="3456" caption="# num" />
        <Typography variant="caption" sx={{ opacity: 0.3, pb: '4px', flexShrink: 0 }}>+</Typography>
        {numEls}
      </Box>
    </Box>
  );
}

// ── Game select screen ────────────────────────────────────────────────────────

const GAME_LIST = [
  { id: 'klondike',     name: 'Klondike',      caption: 'The classic. Seven columns, draw one.',      pattern: '/patterns/klondike.svg',      available: true  },
  { id: 'freecell',     name: 'FreeCell',       caption: 'All cards face-up. Every move counts.',      pattern: '/patterns/freecell.svg',      available: false },
  { id: 'lady-jane',    name: 'Lady Jane',      caption: 'Patience for two full decks.',               pattern: '/patterns/lady-jane.svg',     available: false },
  { id: 'forty-thieves',name: 'Forty Thieves',  caption: 'Two decks. Forty columns. Rarely won.',      pattern: '/patterns/forty-thieves.svg', available: false },
];

// ── Autosave ──────────────────────────────────────────────────────────────────

const saveKey = (id) => `bt-sol-save-${id}`;
function hasSave(id) { try { return !!localStorage.getItem(saveKey(id)); } catch { return false; } }
function loadSave(id) { try { const r = localStorage.getItem(saveKey(id)); return r ? JSON.parse(r) : null; } catch { return null; } }
function clearSave(id) { try { localStorage.removeItem(saveKey(id)); } catch {} }

const SELECT_CARD_W = 120;
const SELECT_CARD_H = 185;

function GameSelectCard({ name, caption, pattern, available, savedGame, onNew, onResume }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, opacity: available ? 1 : 0.45 }}>
      <Box sx={{
        width: SELECT_CARD_W, height: SELECT_CARD_H,
        border: '1.5px solid', borderColor: 'divider',
        borderRadius: '8px', bgcolor: 'background.paper',
        backgroundImage: `url('${pattern}')`,
        backgroundSize: '20% 20%',
      }} />
      <Typography variant="subtitle2" sx={{ textAlign: 'center' }}>{name}</Typography>
      <Typography variant="caption" sx={{ opacity: 0.6, textAlign: 'center', maxWidth: SELECT_CARD_W + 20 }}>
        {caption}
      </Typography>
      {available ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, width: SELECT_CARD_W }}>
          {savedGame && (
            <Button size="small" variant="contained" fullWidth onClick={onResume}>Resume</Button>
          )}
          <Button size="small" variant={savedGame ? 'outlined' : 'contained'} fullWidth onClick={onNew}>
            New Game
          </Button>
        </Box>
      ) : (
        <Typography variant="caption" sx={{ opacity: 0.35, fontSize: '10px' }}>Coming soon</Typography>
      )}
    </Box>
  );
}

function GameSelectScreen({ onNew, onResume }) {
  return (
    <Box sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        {GAME_LIST.map(g => (
          <GameSelectCard
            key={g.id}
            {...g}
            savedGame={g.available && hasSave(g.id)}
            onNew={() => onNew(g.id)}
            onResume={() => onResume(g.id)}
          />
        ))}
      </Box>
    </Box>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function SolitairePage() {
  const [state, dispatch] = useReducer(reducer, null, deal);
  const { solPhase: gamePhase, setSolPhase: setGamePhase, solGameId: gameId, setSolGameId: setGameId } = useSiteSettings();
  const [showRules, setShowRules] = useState(false);
  const [hoveredLegendKey, setHoveredLegendKey] = useState(null);
  const [hoveredCardSig, setHoveredCardSig] = useState(null);
  const sol = useSolitaireSettings();
  const theme = useTheme();
  const won = isWon(state.foundations);

  // Detect dark card background: theme mode when cardBg=theme, or always-light when cardBg=white
  const paperColor = theme.palette.background.paper;
  const darkBg = sol?.cardBg !== 'white' && hexLum(paperColor) < 0.5;

  useEffect(() => {
    const cl = document.documentElement.classList;
    if (sol?.noScroll === 'on') cl.add('sol-no-scroll');
    else cl.remove('sol-no-scroll');
    return () => cl.remove('sol-no-scroll');
  }, [sol?.noScroll]);

  // On mount: if phase was restored as 'playing', load the saved game
  useEffect(() => {
    if (gamePhase === 'playing') {
      const saved = loadSave(gameId);
      if (saved) dispatch({ type: 'LOAD', state: saved });
      else dispatch({ type: 'DEAL' });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Autosave on every move while playing
  useEffect(() => {
    if (gamePhase !== 'playing') return;
    try { localStorage.setItem(saveKey(gameId), JSON.stringify(state)); } catch {}
  }, [state, gamePhase, gameId]);

  const wasteTop = state.waste[state.waste.length - 1] ?? null;
  const wasteSelected = state.selected?.source === 'waste';

  const movingCard = state.selected?.cards[0] ?? null;
  const hintsOn = sol?.dropHints === 'on' && movingCard !== null;
  const validTableau = hintsOn
    ? state.tableau.map(col => canPlaceOnTableau(movingCard, col.length ? col[col.length - 1] : null))
    : Array(7).fill(false);
  const validFoundations = hintsOn && state.selected.cards.length === 1
    ? state.foundations.map(pile => canPlaceOnFoundation(movingCard, pile))
    : Array(4).fill(false);

  // Legend hover/highlight derived state
  const legendHoverOn = sol?.legendHover === 'on';
  const lgSuit = legendHoverOn && hoveredLegendKey?.startsWith('suit:') ? hoveredLegendKey.slice(5) : null;
  const lgRank = legendHoverOn && hoveredLegendKey?.startsWith('rank:') ? hoveredLegendKey.slice(5) : null;
  // onCardHover always fires so legend can react; Legend component decides whether to use it
  const onCardHover = setHoveredCardSig;

  // Visible face-up cards (for legend highlight)
  const visibleCards = [
    ...state.tableau.flatMap(col => col.filter(c => c.faceUp)),
    ...(wasteTop ? [wasteTop] : []),
    ...state.foundations.map(f => f.length ? f[f.length - 1] : null).filter(Boolean),
  ];
  const visibleSuits = new Set(visibleCards.map(c => c.suit));
  const visibleRanks = new Set(visibleCards.map(c => c.rank));

  const legendEl = sol?.showLegend !== 'off' ? (
    <Legend
      sol={sol}
      visibleSuits={visibleSuits}
      visibleRanks={visibleRanks}
      hoveredCardSig={legendHoverOn ? hoveredCardSig : null}
      onHoverKey={setHoveredLegendKey}
      darkBg={darkBg}
    />
  ) : null;
  const legendRight = sol?.legendPosition === 'right';

  function cardIsLH(card) {
    if (!card || !card.faceUp) return false;
    return (lgSuit && card.suit === lgSuit) || (lgRank && card.rank === lgRank);
  }

  return (
    <Box
      className={sol?.noSelect === 'on' ? 'sol-no-select' : undefined}
      sx={{ pb: 4 }}
    >

      {/* ── Phase content ── */}
      {gamePhase === 'select' ? (
        <GameSelectScreen
          onNew={(id) => {
            clearSave(id);
            dispatch({ type: 'DEAL' });
            setGameId(id);
            setGamePhase('playing');
          }}
          onResume={(id) => {
            const saved = loadSave(id);
            dispatch(saved ? { type: 'LOAD', state: saved } : { type: 'DEAL' });
            setGameId(id);
            setGamePhase('playing');
          }}
        />
      ) : (
        <>
          {won && (
            <Box sx={{ mb: 2, p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="body1">You won!</Typography>
            </Box>
          )}

          {/* Legend above (default) */}
          {!legendRight && <Box sx={{ zoom: sol?.legendScale ?? 1 }}>{legendEl}</Box>}

          {/* Game area — optionally beside right legend */}
          <Box sx={legendRight ? { display: 'flex', gap: 1, alignItems: 'flex-start' } : {}}>
            <Box sx={{ ...(legendRight ? { flex: 1, minWidth: 0 } : {}), zoom: sol?.cardScale ?? 1 }}>

              {/* ── Top row: stock / waste / foundations ── */}
              <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                <Box onClick={() => dispatch({ type: 'DRAW' })} sx={{ cursor: 'pointer' }}>
                  {state.stock.length > 0
                    ? <PlayingCard card={state.stock[state.stock.length - 1]} faceDown sol={sol} darkBg={darkBg} />
                    : <EmptySlot onClick={() => dispatch({ type: 'DRAW' })} />
                  }
                </Box>
                <Box onClick={() => wasteTop && dispatch({ type: 'SELECT_WASTE' })}>
                  {wasteTop
                    ? <PlayingCard card={wasteTop} selected={wasteSelected} sol={sol} darkBg={darkBg}
                        legendHighlighted={cardIsLH(wasteTop)} onCardHover={onCardHover}
                        onClick={() => dispatch({ type: 'SELECT_WASTE' })} />
                    : <EmptySlot />
                  }
                </Box>
                <Box sx={{ flex: 1, minWidth: 8 }} />
                {state.foundations.map((pile, i) => (
                  <Box key={i} onClick={() => dispatch({ type: 'SELECT_FOUNDATION', pile: i })}>
                    {pile.length > 0
                      ? <PlayingCard card={pile[pile.length - 1]} sol={sol} isValidTarget={validFoundations[i]} darkBg={darkBg}
                          legendHighlighted={cardIsLH(pile[pile.length - 1])} onCardHover={onCardHover}
                          onClick={() => dispatch({ type: 'SELECT_FOUNDATION', pile: i })} />
                      : <EmptySlot suitDots={SUIT_DOTS[SUITS[i]]} isValidTarget={validFoundations[i]} onClick={() => dispatch({ type: 'SELECT_FOUNDATION', pile: i })} />
                    }
                  </Box>
                ))}
              </Box>

              <Divider sx={{ mb: 2 }} />

              {/* ── Tableau ── */}
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start', overflowX: 'auto', pb: 2 }}>
                {state.tableau.map((col, i) => (
                  <TableauColumn key={i} cards={col} col={i} selected={state.selected} dispatch={dispatch}
                    sol={sol} isValidTarget={validTableau[i]} darkBg={darkBg}
                    lgSuit={lgSuit} lgRank={lgRank} onCardHover={onCardHover} />
                ))}
              </Box>

            </Box>
            {/* Legend right */}
            {legendRight && <Box sx={{ zoom: sol?.legendScale ?? 1 }}>{legendEl}</Box>}
          </Box>

          {/* ── Bottom: rules ── */}
          <Divider sx={{ mt: 2, mb: 1 }} />
          <Box sx={{ mb: 0.5 }}>
            <Button size="small" sx={{ opacity: 0.6 }} onClick={() => setShowRules(v => !v)}>
              {showRules ? 'Hide rules' : 'Rules'}
            </Button>
          </Box>
          <Collapse in={showRules}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, pt: 1 }}>
              <Typography variant="body2"><strong>Goal.</strong> Move all 52 cards onto the four foundation piles, one per suit, built up from Ace to King.</Typography>
              <Typography variant="body2"><strong>Tableau.</strong> Build columns down in alternating colors (red on black, black on red). Click a face-down card to flip it. Click a face-up card to select it, then click a valid destination to move it — along with any cards stacked below. Only a King may start an empty column.</Typography>
              <Typography variant="body2"><strong>Stock & waste.</strong> Click the stock (left) to turn over one card at a time onto the waste pile. The top waste card is always available to play. When the stock runs out, click the empty slot to flip the waste back.</Typography>
              <Typography variant="body2"><strong>Foundations.</strong> Each foundation starts with an Ace and builds up by suit (A → 2 → … → Q → K). Click a selected card, then click the matching foundation to place it.</Typography>
            </Box>
          </Collapse>
        </>
      )}
    </Box>
  );
}

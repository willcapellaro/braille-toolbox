import { useEffect, useReducer, useRef, useState } from 'react';
import { Box, Button, Collapse, Divider, IconButton, Typography } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExpand, faCompress } from '@fortawesome/free-solid-svg-icons';
import { dotsToPattern } from '../content';
import BrailleCell from '../lib/braille/BrailleCell';
import { useSolitaireSettings } from '../context/SolitaireSettingsContext.jsx';

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

function PlayingCard({ card, selected, onClick, faceDown, sol, isValidTarget }) {
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

  return (
    <Box onClick={onClick} sx={{
      width: CARD_W, height: CARD_H,
      border: '1.5px solid',
      borderColor: selected ? 'primary.main' : 'divider',
      borderRadius: '6px',
      bgcolor: selected ? 'action.selected' : 'background.paper',
      outline: selected ? '2px solid' : 'none',
      outlineColor: 'primary.main',
      outlineOffset: '1px',
      display: 'flex', flexDirection: 'column',
      alignItems: 'flex-start', justifyContent: 'space-between',
      padding: `${CARD_PAD}px`, boxSizing: 'border-box',
      cursor: 'pointer', flexShrink: 0,
      transition: 'border-color 0.1s, outline 0.1s',
      ...outlineSx, ...boundsSx, ...dotsSx, ...unraisedSx, ...printSx, ...validTargetSx,
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

function TableauColumn({ cards, col, selected, dispatch, sol, isValidTarget }) {
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

// Cap indicator group: Ace, J, Q, K — prefix is dot 6
const LEGEND_CAP = [
  { label: 'A',  cells: [{ dots: '1',     print: 'A' }] },
  { label: 'J',  cells: [{ dots: '245',   print: 'J' }] },
  { label: 'Q',  cells: [{ dots: '12345', print: 'Q' }] },
  { label: 'K',  cells: [{ dots: '13',    print: 'K' }] },
];

// Number indicator group: 2–10 — prefix is dots 3456
const LEGEND_NUM = [
  { label: '2',  cells: [{ dots: '12',   print: '2' }] },
  { label: '3',  cells: [{ dots: '14',   print: '3' }] },
  { label: '4',  cells: [{ dots: '145',  print: '4' }] },
  { label: '5',  cells: [{ dots: '15',   print: '5' }] },
  { label: '6',  cells: [{ dots: '124',  print: '6' }] },
  { label: '7',  cells: [{ dots: '1245', print: '7' }] },
  { label: '8',  cells: [{ dots: '125',  print: '8' }] },
  { label: '9',  cells: [{ dots: '24',   print: '9' }] },
  { label: '10', cells: [{ dots: '1',    print: '1' }, { dots: '245', print: '0' }] },
];

function LegendCell({ cell, label }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.25 }}>
      <BrailleCell pattern={dotsToPattern(cell.dots)} size={CELL_SZ} label={cell.print}
        style={{ '--cell-dot-color': 'var(--bt-ink)' }} />
      <Typography variant="caption" sx={{ fontSize: '9px', opacity: 0.4 }}>{label}</Typography>
    </Box>
  );
}

function LegendSection({ prefix, prefixLabel, items }) {
  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
      <LegendCell cell={prefix} label={prefixLabel} />
      <Typography variant="caption" sx={{ opacity: 0.4, pb: '4px' }}>+</Typography>
      {items.map(({ label, cells }) => (
        <Box key={label} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.25 }}>
          <Box sx={{ display: 'flex', gap: '3px' }}>
            {cells.map((cell, i) => (
              <BrailleCell key={i} pattern={dotsToPattern(cell.dots)} size={CELL_SZ} label={cell.print}
                style={{ '--cell-dot-color': 'var(--bt-ink)' }} />
            ))}
          </Box>
          <Typography variant="caption" sx={{ fontSize: '9px', opacity: 0.4 }}>{label}</Typography>
        </Box>
      ))}
    </Box>
  );
}

const VDIVIDER = (
  <Box sx={{ alignSelf: 'stretch', width: '1px', bgcolor: 'divider', mx: 0.5, flexShrink: 0 }} />
);

function Legend() {
  return (
    <Box sx={{ mb: 2, display: 'flex', alignItems: 'flex-end', gap: 1, overflowX: 'auto', pb: 0.5 }}>
      {/* Suits */}
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
        {SUITS.map(s => (
          <LegendCell key={s} cell={{ dots: SUIT_DOTS[s], print: SUIT_PRINT[s] }} label={SUIT_PRINT[s]} />
        ))}
      </Box>
      {VDIVIDER}
      <LegendSection prefix={{ dots: '6',    print: '↑' }} prefixLabel="cap" items={LEGEND_CAP} />
      {VDIVIDER}
      <LegendSection prefix={{ dots: '3456', print: '#' }} prefixLabel="num" items={LEGEND_NUM} />
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

const SELECT_CARD_W = 120;
const SELECT_CARD_H = 185;

function GameSelectCard({ name, caption, pattern, available, onClick }) {
  return (
    <Box
      onClick={available ? onClick : undefined}
      sx={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1,
        cursor: available ? 'pointer' : 'default',
        opacity: available ? 1 : 0.45,
        '&:hover .game-card-back': available ? { borderColor: 'text.primary' } : {},
      }}
    >
      <Box
        className="game-card-back"
        sx={{
          width: SELECT_CARD_W, height: SELECT_CARD_H,
          border: '1.5px solid', borderColor: 'divider',
          borderRadius: '8px', bgcolor: 'background.paper',
          backgroundImage: `url('${pattern}')`,
          backgroundSize: '20% 20%',
          transition: 'border-color 0.15s',
        }}
      />
      <Typography variant="subtitle2" sx={{ textAlign: 'center' }}>{name}</Typography>
      <Typography variant="caption" sx={{ opacity: 0.6, textAlign: 'center', maxWidth: SELECT_CARD_W + 20 }}>
        {caption}
      </Typography>
      {!available && <Typography variant="caption" sx={{ opacity: 0.35, fontSize: '10px' }}>Coming soon</Typography>}
    </Box>
  );
}

function GameSelectScreen({ onSelect }) {
  return (
    <Box sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        {GAME_LIST.map(g => (
          <GameSelectCard key={g.id} {...g} onClick={() => onSelect(g.id)} />
        ))}
      </Box>
    </Box>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function SolitairePage() {
  const [state, dispatch] = useReducer(reducer, null, deal);
  const [gamePhase, setGamePhase] = useState('select'); // 'select' | 'playing'
  const [showLegend, setShowLegend] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);
  const sol = useSolitaireSettings();
  const won = isWon(state.foundations);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  useEffect(() => {
    const cl = document.documentElement.classList;
    if (sol?.noScroll === 'on') cl.add('sol-no-scroll');
    else cl.remove('sol-no-scroll');
    return () => cl.remove('sol-no-scroll');
  }, [sol?.noScroll]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen();
    else document.exitFullscreen();
  };

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

  if (gamePhase === 'select') {
    return <GameSelectScreen onSelect={() => { dispatch({ type: 'DEAL' }); setGamePhase('playing'); }} />;
  }

  return (
    <Box ref={containerRef} className={sol?.noSelect === 'on' ? 'sol-no-select' : undefined} sx={{ pb: 4 }}>
      {/* ── Controls row ── */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, flexWrap: 'wrap' }}>
        <Button size="small" variant="outlined" onClick={() => dispatch({ type: 'DEAL' })}>New game</Button>
        <Button size="small" sx={{ opacity: 0.6 }} onClick={() => setGamePhase('select')}>Games</Button>
        <Box sx={{ flex: 1 }} />
        <IconButton size="small" onClick={toggleFullscreen} title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'} sx={{ color: 'text.primary' }}>
          <FontAwesomeIcon icon={isFullscreen ? faCompress : faExpand} style={{ fontSize: '0.85rem' }} />
        </IconButton>
      </Box>

      {won && (
        <Box sx={{ mb: 2, p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
          <Typography variant="body1">You won!</Typography>
        </Box>
      )}

      {/* ── Top row: stock / waste / foundations ── */}
      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
        <Box onClick={() => dispatch({ type: 'DRAW' })} sx={{ cursor: 'pointer' }}>
          {state.stock.length > 0
            ? <PlayingCard card={state.stock[state.stock.length - 1]} faceDown sol={sol} />
            : <EmptySlot onClick={() => dispatch({ type: 'DRAW' })} />
          }
        </Box>
        <Box onClick={() => wasteTop && dispatch({ type: 'SELECT_WASTE' })}>
          {wasteTop
            ? <PlayingCard card={wasteTop} selected={wasteSelected} sol={sol} onClick={() => dispatch({ type: 'SELECT_WASTE' })} />
            : <EmptySlot />
          }
        </Box>
        <Box sx={{ flex: 1, minWidth: 8 }} />
        {state.foundations.map((pile, i) => (
          <Box key={i} onClick={() => dispatch({ type: 'SELECT_FOUNDATION', pile: i })}>
            {pile.length > 0
              ? <PlayingCard card={pile[pile.length - 1]} sol={sol} isValidTarget={validFoundations[i]} onClick={() => dispatch({ type: 'SELECT_FOUNDATION', pile: i })} />
              : <EmptySlot suitDots={SUIT_DOTS[SUITS[i]]} isValidTarget={validFoundations[i]} onClick={() => dispatch({ type: 'SELECT_FOUNDATION', pile: i })} />
            }
          </Box>
        ))}
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* ── Tableau ── */}
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start', overflowX: 'auto', pb: 2 }}>
        {state.tableau.map((col, i) => (
          <TableauColumn key={i} cards={col} col={i} selected={state.selected} dispatch={dispatch} sol={sol} isValidTarget={validTableau[i]} />
        ))}
      </Box>

      {/* ── Bottom: legend + rules toggles ── */}
      <Divider sx={{ mt: 2, mb: 1 }} />
      <Box sx={{ display: 'flex', gap: 1, mb: 0.5 }}>
        <Button size="small" sx={{ opacity: 0.6 }} onClick={() => setShowLegend(v => !v)}>
          {showLegend ? 'Hide legend' : 'Legend'}
        </Button>
        <Button size="small" sx={{ opacity: 0.6 }} onClick={() => setShowRules(v => !v)}>
          {showRules ? 'Hide rules' : 'Rules'}
        </Button>
      </Box>
      <Collapse in={showLegend}><Legend /></Collapse>
      <Collapse in={showRules}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, pt: 1 }}>
          <Typography variant="body2"><strong>Goal.</strong> Move all 52 cards onto the four foundation piles, one per suit, built up from Ace to King.</Typography>
          <Typography variant="body2"><strong>Tableau.</strong> Build columns down in alternating colors (red on black, black on red). Click a face-down card to flip it. Click a face-up card to select it, then click a valid destination to move it — along with any cards stacked below. Only a King may start an empty column.</Typography>
          <Typography variant="body2"><strong>Stock & waste.</strong> Click the stock (left) to turn over one card at a time onto the waste pile. The top waste card is always available to play. When the stock runs out, click the empty slot to flip the waste back.</Typography>
          <Typography variant="body2"><strong>Foundations.</strong> Each foundation starts with an Ace and builds up by suit (A → 2 → … → Q → K). Click a selected card, then click the matching foundation to place it.</Typography>
        </Box>
      </Collapse>
    </Box>
  );
}

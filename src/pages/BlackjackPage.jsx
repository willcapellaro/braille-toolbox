import { useEffect, useReducer, useState } from 'react';
import { Box, Button, Divider, Typography } from '@mui/material';
import BrailleCell from '../lib/braille/BrailleCell';
import { dotsToPattern } from '../content';
import { useSolitaireSettings } from '../context/SolitaireSettingsContext.jsx';

// ── Card data (same encoding as SolitairePage) ────────────────────────────────

const SUITS   = ['c', 'd', 'h', 's'];
const RANKS   = ['_A','N2','N3','N4','N5','N6','N7','N8','N9','N10','_J','_Q','_K'];

const SUIT_DOTS  = { c: '14', d: '145', h: '125', s: '234' };
const SUIT_PRINT = { c: '♣', d: '♦', h: '♥', s: '♠' };
const SUIT_COLOR = { h: '#cc2200', d: '#9b3a2a', s: '#0d0d0d', c: '#1e2e3d' };

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

const DOTS_TO_ORTHO = {
  '1':'A/1','12':'B/2','14':'C/3','145':'D/4','15':'E/5',
  '124':'F/6','1245':'G/7','125':'H/8','24':'I/9','245':'J/0',
  '13':'K','123':'L','134':'M','1345':'N','135':'O',
  '1234':'P','12345':'Q','1235':'R','234':'S','2345':'T',
  '136':'U','1236':'V','2456':'W','1346':'X','13456':'Y','1356':'Z',
  '6':'^','3456':'#',
};

// ── Card sizing (matches SolitairePage) ───────────────────────────────────────

const CELL_SZ  = 'xs';
const CELL_M   = { dotSize: 6, cellGap: 4, padding: 5 };
const CELL_W   = 2 * CELL_M.dotSize + CELL_M.cellGap + 2 * CELL_M.padding + 2;
const CARD_PAD = 6;
const CELL_GAP = 3;
const CARD_W   = 3 * CELL_W + 2 * CELL_GAP + 2 * CARD_PAD;
const CARD_H   = Math.round(CARD_W * 1.55);

// ── Game logic ────────────────────────────────────────────────────────────────

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

function rankValue(rank) {
  if (rank === '_A') return 11;
  if (['_J', '_Q', '_K'].includes(rank)) return 10;
  return parseInt(rank.slice(1), 10);
}

function handTotal(cards) {
  let total = 0, aces = 0;
  for (const c of cards) {
    if (c.faceDown) continue;
    total += rankValue(c.rank);
    if (c.rank === '_A') aces++;
  }
  while (total > 21 && aces > 0) { total -= 10; aces--; }
  return total;
}

function compareResult(playerTotal, dealerTotal) {
  if (playerTotal > 21) return 'bust';
  if (dealerTotal > 21) return 'win';
  if (playerTotal > dealerTotal) return 'win';
  if (playerTotal < dealerTotal) return 'lose';
  return 'push';
}

function freshDeal() {
  const deck = shuffle(buildDeck());
  const player = [deck[0], deck[2]];
  const dealer = [{ ...deck[1], faceDown: true }, deck[3]];
  return { deck: deck.slice(4), player, dealer };
}

const INITIAL = { deck: [], player: [], dealer: [], phase: 'idle', result: null };

function reducer(state, action) {
  switch (action.type) {
    case 'DEAL': {
      const { deck, player, dealer } = freshDeal();
      // Natural blackjack check
      if (handTotal(player) === 21) {
        const dealerRevealed = dealer.map(c => ({ ...c, faceDown: false }));
        const result = handTotal(dealerRevealed) === 21 ? 'push' : 'blackjack';
        return { deck, player, dealer: dealerRevealed, phase: 'result', result };
      }
      return { deck, player, dealer, phase: 'player', result: null };
    }
    case 'HIT': {
      if (state.phase !== 'player' || !state.deck.length) return state;
      const player = [...state.player, state.deck[0]];
      const deck = state.deck.slice(1);
      if (handTotal(player) > 21)
        return { ...state, player, deck, phase: 'result', result: 'bust' };
      return { ...state, player, deck };
    }
    case 'STAND': {
      if (state.phase !== 'player') return state;
      let dealer = state.dealer.map(c => ({ ...c, faceDown: false }));
      let deck = [...state.deck];
      while (handTotal(dealer) < 17 && deck.length) {
        dealer = [...dealer, deck[0]];
        deck = deck.slice(1);
      }
      const result = compareResult(handTotal(state.player), handTotal(dealer));
      return { ...state, dealer, deck, phase: 'result', result };
    }
    default:
      return state;
  }
}

// ── Braille text rendering ────────────────────────────────────────────────────

const BRAILLE_ALPHA = {
  a:'⠁',b:'⠃',c:'⠉',d:'⠙',e:'⠑',f:'⠋',g:'⠛',h:'⠓',i:'⠊',j:'⠚',
  k:'⠅',l:'⠇',m:'⠍',n:'⠝',o:'⠕',p:'⠏',q:'⠟',r:'⠗',s:'⠎',t:'⠞',
  u:'⠥',v:'⠧',w:'⠺',x:'⠭',y:'⠽',z:'⠵',
};
const BRAILLE_PUNCT = { '.':'⠲', '!':'⠖', '?':'⠦', ',':'⠂', "'": '⠄' };
const BRAILLE_DIGIT = { '0':'⠚','1':'⠁','2':'⠃','3':'⠉','4':'⠙','5':'⠑','6':'⠋','7':'⠛','8':'⠓','9':'⠊' };
const CAP_SIGN = '⠠';
const NUM_SIGN = '⠼';

// Convert a string to [{braille, print}] pairs, with capital indicators
function textPairs(str) {
  const pairs = [];
  for (const ch of str) {
    if (ch === ' ') { pairs.push({ braille: ' ', print: ' ', isSpace: true }); continue; }
    const isUpper = ch >= 'A' && ch <= 'Z';
    if (isUpper) pairs.push({ braille: CAP_SIGN, print: '^' });
    const b = BRAILLE_ALPHA[ch.toLowerCase()] ?? BRAILLE_PUNCT[ch] ?? ch;
    pairs.push({ braille: b, print: ch });
  }
  return pairs;
}

// Convert a number to [{braille, print}] pairs (# sign + digits)
function numPairs(n) {
  return [{ braille: NUM_SIGN, print: '#' },
    ...String(n).split('').map(d => ({ braille: BRAILLE_DIGIT[d] ?? d, print: d }))];
}

// Single fixed-width hoverable braille cell — font enforced here, not inherited
function BrailleChar({ braille, print, printHover }) {
  const [hovered, setHovered] = useState(false);
  return (
    <span
      onMouseEnter={printHover ? () => setHovered(true) : undefined}
      onMouseLeave={printHover ? () => setHovered(false) : undefined}
      style={{ display: 'inline-block', width: '1ch', textAlign: 'center', cursor: 'default', fontFamily: 'monospace' }}
    >
      {printHover && hovered ? print : braille}
    </span>
  );
}

// Render a number in braille with per-character hover
function BrailleNum({ n, sol }) {
  const printHover = sol?.printOverlay === 'hover';
  return (
    <Box component="span" sx={{ fontFamily: 'monospace' }}>
      {numPairs(n).map(({ braille, print, isMod }, i) => (
        <BrailleChar key={i} braille={braille} print={print} printHover={printHover} isMod={isMod} />
      ))}
    </Box>
  );
}

// Render a text string in braille with per-character hover
function BrailleText({ text, sol }) {
  const printHover = sol?.printOverlay === 'hover';
  return (
    <Box component="span" sx={{ fontFamily: 'monospace' }}>
      {textPairs(text).map(({ braille, print, isSpace, isMod }, i) =>
        isSpace
          ? <Box key={i} component="span" sx={{ display: 'inline-block', width: '0.6ch', fontFamily: 'monospace' }} />
          : <BrailleChar key={i} braille={braille} print={print} printHover={printHover} isMod={isMod} />
      )}
    </Box>
  );
}

// ── Card rendering ────────────────────────────────────────────────────────────

function CellWithPrint({ cell, dotColor, showPrintOverlay, printStyle }) {
  const label = showPrintOverlay
    ? (printStyle === 'ortho' ? (DOTS_TO_ORTHO[cell.dots] ?? cell.print) : cell.print)
    : null;
  const isSlash = label?.includes('/');
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex', flexShrink: 0 }}>
      <BrailleCell pattern={dotsToPattern(cell.dots)} size={CELL_SZ} label={cell.print}
        style={{ '--cell-dot-color': dotColor }} />
      {label !== null && (
        <Box component="span" className="card-print-label" sx={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          lineHeight: 1, fontFamily: 'monospace', fontWeight: 'bold',
          fontSize: isSlash ? '9px' : '13px',
          color: dotColor, pointerEvents: 'none', userSelect: 'none',
        }}>
          {isSlash ? label.split('/').map((p, i) => <span key={i}>{p}</span>) : label}
        </Box>
      )}
    </Box>
  );
}

function BJCard({ card, sol, darkBg }) {
  if (card.faceDown) {
    return (
      <Box sx={{
        width: CARD_W, height: CARD_H,
        border: '1.5px solid', borderColor: 'divider',
        borderRadius: '6px', bgcolor: 'background.paper',
        backgroundImage: `url('/patterns/klondike.svg')`,
        backgroundSize: '20% 20%', flexShrink: 0,
      }} />
    );
  }
  const dotColor = sol?.suitColor === 'on' ? SUIT_COLOR[card.suit] : 'var(--bt-ink)';
  const showPrint = sol?.printOverlay !== 'never';
  const printStyle = sol?.printStyle ?? 'exact';
  const dotOutlineSx = darkBg ? { '& .braille-dot.is-raised': { boxShadow: '0 0 0 1.5px #ffffff' } } : {};
  const boundsSx = sol?.cellBounds === 'always'
    ? { '& .braille-cell': { '--cell-border-color': 'var(--bt-border)' } }
    : { '& .braille-cell': { '--cell-border-color': 'transparent' } };
  const dotsSx = sol?.brailleDots === 'hover'
    ? { '& .braille-dot.is-raised': { opacity: 0, transition: 'opacity 0.12s' }, '&:hover .braille-dot.is-raised': { opacity: 1 } }
    : {};
  const unraisedSx = sol?.unraisedDots === 'never'
    ? { '& .braille-dot.is-flat': { opacity: 0 } }
    : sol?.unraisedDots === 'hover'
    ? { '& .braille-dot.is-flat': { opacity: 0, transition: 'opacity 0.12s' }, '&:hover .braille-dot.is-flat': { opacity: 1 } }
    : {};
  const printSx = sol?.printOverlay === 'hover' ? {
    '& .card-print-label':            { opacity: 0, transition: 'opacity 0.15s' },
    '&:hover .card-print-label':      { opacity: 1 },
    '& .braille-dot.is-raised':       { transition: 'opacity 0.15s' },
    '&:hover .braille-dot.is-raised': { opacity: 0 },
  } : sol?.printOverlay === 'always' ? {
    '& .braille-dot.is-raised': { opacity: 0.15 },
  } : {};

  return (
    <Box sx={{
      width: CARD_W, height: CARD_H,
      border: '1.5px solid', borderColor: 'divider', borderRadius: '6px',
      bgcolor: sol?.cardBg === 'white' ? '#ffffff' : 'background.paper',
      display: 'flex', flexDirection: 'column',
      alignItems: 'flex-start', justifyContent: 'space-between',
      padding: `${CARD_PAD}px`, boxSizing: 'border-box', flexShrink: 0,
      ...boundsSx, ...dotsSx, ...unraisedSx, ...printSx, ...dotOutlineSx,
    }}>
      <Box sx={{ display: 'flex', gap: `${CELL_GAP}px` }}>
        {RANK_CELLS[card.rank].map((cell, i) => (
          <CellWithPrint key={i} cell={cell} dotColor={dotColor} showPrintOverlay={showPrint} printStyle={printStyle} />
        ))}
      </Box>
      <CellWithPrint
        cell={{ dots: SUIT_DOTS[card.suit], print: SUIT_PRINT[card.suit] }}
        dotColor={dotColor} showPrintOverlay={showPrint} printStyle={printStyle}
      />
    </Box>
  );
}

// ── Main game ─────────────────────────────────────────────────────────────────

const RESULT_MSG = {
  win:       'You win!',
  blackjack: 'Blackjack!',
  lose:      'Dealer wins.',
  bust:      'Bust.',
  push:      'Push.',
};

export default function BlackjackGame({ darkBg }) {
  const sol = useSolitaireSettings();
  const [state, dispatch] = useReducer(reducer, INITIAL);
  const [wins, setWins]     = useState(0);
  const [losses, setLosses] = useState(0);
  const [pushes, setPushes] = useState(0);

  useEffect(() => {
    if (state.result === 'win' || state.result === 'blackjack') setWins(w => w + 1);
    else if (state.result === 'bust' || state.result === 'lose') setLosses(l => l + 1);
    else if (state.result === 'push') setPushes(p => p + 1);
  }, [state.result]);

  const playerTotal = handTotal(state.player);
  const dealerVisible = state.dealer.filter(c => !c.faceDown);
  const dealerShownTotal = handTotal(dealerVisible);

  return (
    <Box sx={{ zoom: sol?.cardScale ?? 1 }}>

      {/* Dealer hand */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
          Dealer{state.phase === 'result'
            ? <>{': '}<BrailleNum n={handTotal(state.dealer)} sol={sol} /></>
            : dealerShownTotal > 0 ? <>{': '}<BrailleNum n={dealerShownTotal} sol={sol} />{'+'}</> : ''}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
          {state.dealer.map((card, i) => <BJCard key={card.id ?? i} card={card} sol={sol} darkBg={darkBg} />)}
        </Box>
      </Box>

      <Divider sx={{ my: 1.5 }} />

      {/* Player hand */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
          You{playerTotal > 0 ? <>{': '}<BrailleNum n={playerTotal} sol={sol} /></> : ''}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
          {state.player.map((card, i) => <BJCard key={card.id ?? i} card={card} sol={sol} darkBg={darkBg} />)}
        </Box>
      </Box>

      {/* Actions */}
      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap', mt: 1 }}>
        {state.phase === 'idle' && (
          <Button variant="contained" onClick={() => dispatch({ type: 'DEAL' })}>Deal</Button>
        )}
        {state.phase === 'player' && (<>
          <Button variant="contained" onClick={() => dispatch({ type: 'HIT' })}>Hit</Button>
          <Button variant="outlined"  onClick={() => dispatch({ type: 'STAND' })}>Stand</Button>
        </>)}
        {state.phase === 'result' && (<>
          <Typography variant="subtitle1">
            <BrailleText text={RESULT_MSG[state.result]} sol={sol} />
          </Typography>
          <Button variant="contained" onClick={() => dispatch({ type: 'DEAL' })}>Deal again</Button>
        </>)}

        {/* Score */}
        {(wins + losses + pushes) > 0 && (
          <Typography variant="body1" sx={{ ml: 1 }}>
            <BrailleNum n={wins} sol={sol} />{' W / '}
            <BrailleNum n={losses} sol={sol} />{' L / '}
            <BrailleNum n={pushes} sol={sol} />{' P'}
          </Typography>
        )}
      </Box>

    </Box>
  );
}

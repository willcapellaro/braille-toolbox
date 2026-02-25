import { Box, Card, CardContent, CircularProgress, Grid, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';

const dots = [
  { id: 1, row: 0, col: 0 },
  { id: 2, row: 1, col: 0 },
  { id: 3, row: 2, col: 0 },
  { id: 4, row: 0, col: 1 },
  { id: 5, row: 1, col: 1 },
  { id: 6, row: 2, col: 1 },
];

export default function DotDecoderPage() {
  const [dotStates, setDotStates] = useState([true, false, false, false, false, false]);
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    fetch(`${import.meta.env.BASE_URL}dot-decoder-content-blank.json`)
      .then((response) => response.json())
      .then((data) => {
        if (!isMounted) {
          return;
        }
        setEntries(Array.isArray(data) ? data : []);
        setIsLoading(false);
      })
      .catch(() => {
        if (!isMounted) {
          return;
        }
        setEntries([]);
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const binaryString = useMemo(() => {
    let output = '';
    for (let index = 5; index >= 0; index -= 1) {
      output += dotStates[index] ? '1' : '0';
    }
    return output;
  }, [dotStates]);

  const activeEntry = useMemo(
    () => entries.find((entry) => entry.binary === binaryString),
    [entries, binaryString]
  );

  const handleToggle = (dotId) => {
    setDotStates((prev) => {
      const next = [...prev];
      next[dotId - 1] = !next[dotId - 1];
      return next;
    });
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dot Decoder
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              gap: 2.5,
              maxWidth: 280,
              mx: { xs: 'auto', md: 0 },
            }}
          >
            {dots.map((dot) => {
              const isOn = dotStates[dot.id - 1];
              return (
                <Box
                  key={dot.id}
                  role="button"
                  aria-pressed={isOn}
                  onClick={() => handleToggle(dot.id)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      handleToggle(dot.id);
                    }
                  }}
                  tabIndex={0}
                  sx={{
                    width: 112,
                    height: 112,
                    borderRadius: '50%',
                    border: '2px solid',
                    borderColor: isOn ? 'primary.main' : 'divider',
                    backgroundColor: isOn ? 'primary.main' : 'transparent',
                    boxShadow: isOn ? '0 12px 24px rgba(33, 61, 86, 0.25)' : 'none',
                    transition: 'all 180ms ease',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    outline: 'none',
                    '&:focus-visible': {
                      boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.35)',
                    },
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ color: isOn ? 'common.white' : 'text.secondary', fontWeight: 600 }}
                  >
                    {dot.id}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Grid>

        <Grid item xs={12} md={7}>
          <Card variant="outlined" sx={{ minHeight: 240 }}>
            <CardContent>
              {isLoading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={20} />
                  <Typography variant="body2" color="text.secondary">
                    Loading definitions...
                  </Typography>
                </Box>
              ) : (
                <>
                  <Typography variant="h5" component="h2" gutterBottom>
                    {activeEntry?.dataDecoded?.titvar || 'No match'}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    dangerouslySetInnerHTML={{
                      __html: activeEntry?.dataDecoded?.descvar || 'Select a dot pattern to decode.',
                    }}
                  />
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

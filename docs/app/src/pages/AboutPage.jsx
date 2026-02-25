import { Box, Divider, Stack, Typography } from '@mui/material';

export default function AboutPage() {
  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 3,
          border: '1px solid #eadfce',
          background:
            'linear-gradient(135deg, #f7efe4 0%, #fff8ee 55%, #f1f4f8 100%)',
          mb: 3,
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontFamily: "'Fraunces', 'Georgia', serif",
            fontWeight: 700,
            color: '#241910',
            mb: 1,
          }}
        >
          About Braille Toolbox
        </Typography>
        <Typography variant="body1" sx={{ maxWidth: 720, color: '#3d2f24' }}>
Braille Toolbox is a collection of practical tools and references for braille learners and the braille-curious. It’s designed to be approachable, reliable, and accurate, making braille inviting and useful while respecting its role in independent access. The project is led by Will Capellaro, whose early work designing a braille device sparked a lifelong focus on solving braille challenges.
        </Typography>
              <br></br>
        <Divider>
       <br></br>
        </Divider>
                  <Typography
            variant="h6"
            sx={{ fontFamily: "'Fraunces', 'Georgia', serif", mb: 0.5 }}
          >
            Technical notes
          </Typography>
          <Typography variant="body2" color="text.secondary">
We follow UEB Braille Standards closely. Beta pages may still miss edge cases, so please report anything that looks off. Accessibility is a top priority, and we iterate methodically toward full support.

          </Typography>
      </Box>
      <Stack spacing={2} sx={{ maxWidth: 900 }}>
      </Stack>
    </Box>
  );
}

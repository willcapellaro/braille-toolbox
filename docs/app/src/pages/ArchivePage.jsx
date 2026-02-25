import { Box, Link, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const updatedLinks = [
  { to: '/about', label: 'About' },
  { to: '/decode', label: 'Dot Decoder' },
  { to: '/write', label: 'Write in Braille' },
  { to: '/braillewrite-help', label: 'Braillewriter Help' },
];

const archivedLinks = [];

export default function ArchivePage() {
  const archiveBase = `${import.meta.env.BASE_URL}archive/`;

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Archive
      </Typography>
      <Typography variant="body1" sx={{ mb: 1 }}>
        These pages are from the legacy version of Braille Toolbox. Stay tuned for updated versions.
      </Typography>
      <Box component="ul" sx={{ pl: 3, m: 0, mb: 2 }}>
        {updatedLinks.map((item) => (
          <Box component="li" key={item.to} sx={{ mb: 0.75 }}>
            <Link component={RouterLink} to={item.to}>
              {item.label}
            </Link>
          </Box>
        ))}
      </Box>
      {archivedLinks.length > 0 && (
        <>
          <Typography variant="body1" sx={{ mb: 1 }}>
            Legacy pages remain available during the rebuild.
          </Typography>
          <Box component="ul" sx={{ pl: 3, m: 0 }}>
            {archivedLinks.map((item) => (
              <Box component="li" key={item.file} sx={{ mb: 0.75 }}>
                <Link href={`${archiveBase}${item.file}`}>{item.label}</Link>
              </Box>
            ))}
          </Box>
        </>
      )}
    </Box>
  );
}
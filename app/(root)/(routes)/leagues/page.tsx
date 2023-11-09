import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import Link from 'next/link';

export default function Teams() {
  return (
    <div className="p-3">
      <h2 className="mb-4">Active Leagues</h2>

      <Link href="/leagues/1">
        <Card>
          <CardActionArea>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                FUTO ELITES BASKETBALL LEAGUE
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Futo elites
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Link>

    </div>
  )
}

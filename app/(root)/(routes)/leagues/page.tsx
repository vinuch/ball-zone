"use client"
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';
import supabase from '@/lib/supabase';
import CircularProgress from '@mui/material/CircularProgress';

interface League {
  id: string;
  name: string;
  logo: string;
  created_at: string;
}
export default function Leagues() {
  const [leagues, setLeagues] = useState<League[] | any[]>([])
  // const supabase = createClientComponentClient()
  useEffect(() => {
    const fetchLeagues = async () => {
      let { data: Leagues, error } = await supabase
        .from('Leagues')
        .select('*')

      setLeagues(Leagues!)
    }

    fetchLeagues()

    return () => {

    }
  }, [])

  // if (!leagues) {
  //   return <div className="flex justify-center items-center">
  //     <CircularProgress />
  //   </div>
  // }

  return (
    <div className="p-3">
      <h2 className="mb-4">Active Leagues</h2>


      {leagues?.map(league => (
        <Link key={league.id} href={`/leagues/${league.id}`}>
          <Card>
            <CardActionArea>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {league.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Futo elites
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Link>

      ))}


    </div>
  )
}

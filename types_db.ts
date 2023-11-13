export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      fouls: {
        Row: {
          created_at: string
          foul_count: number | null
          game_id: string | null
          id: number
          status: number | null
          team_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          foul_count?: number | null
          game_id?: string | null
          id?: number
          status?: number | null
          team_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          foul_count?: number | null
          game_id?: string | null
          id?: number
          status?: number | null
          team_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fouls_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "Games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fouls_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fouls_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["user_id"]
          }
        ]
      }
      Games: {
        Row: {
          away_team_id: string | null
          created_at: string
          first_quarter_score: number | null
          fourth_quarter_score: number | null
          home_team_id: string | null
          id: string
          second_quater_score: number | null
          third_quater_score: number | null
        }
        Insert: {
          away_team_id?: string | null
          created_at?: string
          first_quarter_score?: number | null
          fourth_quarter_score?: number | null
          home_team_id?: string | null
          id?: string
          second_quater_score?: number | null
          third_quater_score?: number | null
        }
        Update: {
          away_team_id?: string | null
          created_at?: string
          first_quarter_score?: number | null
          fourth_quarter_score?: number | null
          home_team_id?: string | null
          id?: string
          second_quater_score?: number | null
          third_quater_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "Games_away_team_id_fkey"
            columns: ["away_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Games_home_team_id_fkey"
            columns: ["home_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          }
        ]
      }
      substitutes: {
        Row: {
          created_at: string
          game_id: string | null
          id: string
          in: string | null
          out: string | null
          time: string | null
        }
        Insert: {
          created_at?: string
          game_id?: string | null
          id?: string
          in?: string | null
          out?: string | null
          time?: string | null
        }
        Update: {
          created_at?: string
          game_id?: string | null
          id?: string
          in?: string | null
          out?: string | null
          time?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "substitutes_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "Games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "substitutes_in_fkey"
            columns: ["in"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "substitutes_out_fkey"
            columns: ["out"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["user_id"]
          }
        ]
      }
      team_user: {
        Row: {
          created_at: string
          id: number
          team_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          team_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          team_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_user_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          }
        ]
      }
      teams: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          location: string | null
          logo: string | null
          name: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          location?: string | null
          logo?: string | null
          name?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          location?: string | null
          logo?: string | null
          name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "teams_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["user_id"]
          }
        ]
      }
      Users: {
        Row: {
          auth_user: string | null
          created_at: string
          DOB: string | null
          first_name: string | null
          height: number | null
          last_name: string | null
          location: string | null
          position: string | null
          profile_img: string | null
          user_id: string
          weight: number | null
        }
        Insert: {
          auth_user?: string | null
          created_at?: string
          DOB?: string | null
          first_name?: string | null
          height?: number | null
          last_name?: string | null
          location?: string | null
          position?: string | null
          profile_img?: string | null
          user_id?: string
          weight?: number | null
        }
        Update: {
          auth_user?: string | null
          created_at?: string
          DOB?: string | null
          first_name?: string | null
          height?: number | null
          last_name?: string | null
          location?: string | null
          position?: string | null
          profile_img?: string | null
          user_id?: string
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "Users_auth_user_fkey"
            columns: ["auth_user"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

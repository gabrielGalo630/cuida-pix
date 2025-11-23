'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function WhoAmI() {
  const [id, setId] = useState('');

  useEffect(() => {
    async function load() {
      const { data } = await supabase.auth.getSession();
      setId(data.session?.user?.id || 'nenhum usuário logado');
    }
    load();
  }, []);

  return (
    <div style={{ padding: 40, color: 'white' }}>
      <h1>User ID:</h1>
      <p>{id}</p>
    </div>
  );
}

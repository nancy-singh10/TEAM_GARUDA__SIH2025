import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const items = [
  {
    name: 'EV Charging Station',
    description: 'Level 2 Electric Vehicle charging station for campus parking slots.',
    token_cost: 5000,
    category: 'Infrastructure',
    image_url: '/store/ev_charger.png'
  },
  {
    name: 'Smart Electric Geyser',
    description: 'Energy-efficient IoT-enabled geyser for hostels.',
    token_cost: 800,
    category: 'Appliances',
    image_url: '/store/smart_geyser.png'
  },
  {
    name: 'Solar Street Light',
    description: 'Standalone solar street light with motion sensor.',
    token_cost: 1200,
    category: 'Infrastructure',
    image_url: '/store/solar_light.png'
  },
  {
    name: 'Smart Meter',
    description: 'Advanced metering infrastructure for precise monitoring.',
    token_cost: 1500,
    category: 'Devices',
    image_url: '/store/smart_meter.png'
  }
];

async function seedStore() {
  console.log("Seeding store items...");
  
  for (const item of items) {
    // Check if it already exists
    const { data: existing } = await supabase
      .from('store_items')
      .select('id')
      .eq('name', item.name)
      .single();
      
    if (!existing) {
      const { error } = await supabase
        .from('store_items')
        .insert(item);
        
      if (error) {
        console.error(`Failed to insert ${item.name}:`, error.message);
      } else {
        console.log(`Inserted ${item.name}`);
      }
    } else {
      console.log(`${item.name} already exists. Updating image URL...`);
      await supabase
        .from('store_items')
        .update({ image_url: item.image_url })
        .eq('id', existing.id);
    }
  }
  
  console.log("Done seeding store items.");
}

seedStore();

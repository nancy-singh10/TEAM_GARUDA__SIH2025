-- Update existing items with local image URLs
update public.store_items 
set image_url = '/store/ev_charger.png' 
where name = 'EV Charging Station';

update public.store_items 
set image_url = '/store/smart_geyser.png' 
where name = 'Smart Electric Geyser';

update public.store_items 
set image_url = '/store/solar_light.png' 
where name = 'Solar Street Light';

update public.store_items 
set image_url = '/store/smart_meter.png' 
where name = 'Smart Meter';

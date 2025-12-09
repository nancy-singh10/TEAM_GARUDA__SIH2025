import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const campus_id = searchParams.get('campus_id');

        if (!campus_id) {
            return NextResponse.json({ error: 'Campus ID required' }, { status: 400 });
        }

        const { data, error } = await supabaseAdmin
            .from('student_charging_logs')
            .select('*')
            .eq('campus_admin_id', campus_id)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { campus_admin_id, phone_number, energy_used, student_name } = body;

        if (!campus_admin_id || !phone_number || !energy_used) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Calculate tokens
        // Rule: 1 kWh = 10 Tokens (Green Points)
        const TOKEN_MULTIPLIER = 10;
        const tokens_earned = Math.round(Number(energy_used) * TOKEN_MULTIPLIER);

        // 1. Check for existing record
        const { data: existingRecord } = await supabaseAdmin
            .from('student_charging_logs')
            .select('*')
            .eq('phone_number', phone_number)
            .single();

        let data, error;
        let totalTokensBefore = 0;
        let totalTokensAfter = 0;

        if (existingRecord) {
            // -- UPDATE EXISTING --
            totalTokensBefore = existingRecord.tokens_earned;
            totalTokensAfter = totalTokensBefore + tokens_earned;

            const { data: updatedData, error: updateError } = await supabaseAdmin
                .from('student_charging_logs')
                .update({
                    energy_used: existingRecord.energy_used + Number(energy_used),
                    tokens_earned: totalTokensAfter,
                    session_count: (existingRecord.session_count || 1) + 1,
                    student_name: student_name || existingRecord.student_name // Update name if provided
                })
                .eq('id', existingRecord.id)
                .select()
                .single();

            data = updatedData;
            error = updateError;

        } else {
            // -- INSERT NEW --
            // If it's a new record, tokens before is 0
            totalTokensBefore = 0;
            totalTokensAfter = tokens_earned;

            const { data: insertedData, error: insertError } = await supabaseAdmin
                .from('student_charging_logs')
                .insert([
                    {
                        campus_admin_id,
                        phone_number,
                        energy_used,
                        tokens_earned,
                        student_name,
                        session_count: 1
                    }
                ])
                .select()
                .single();

            data = insertedData;
            error = insertError;
        }

        if (error) throw error;

        const VOUCHER_THRESHOLD = 100;

        // Check for Voucher Unlock
        if (totalTokensBefore < VOUCHER_THRESHOLD && totalTokensAfter >= VOUCHER_THRESHOLD) {
            // Dynamic import to avoid build issues if twilio is not perfectly set up
            const { sendVoucherSMS } = await import('@/lib/smsClient');
            // await sendVoucherSMS(phone_number, totalTokensAfter);
        }

        return NextResponse.json({ success: true, data });

    } catch (error: any) {
        console.error("API Error", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

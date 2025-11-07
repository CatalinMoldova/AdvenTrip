import { supabase } from "../lib/supabase";

interface UserDataResponse {
    success: boolean;
    msg?: string;
    data?: any;
}

export const getUserData = async (userId: string): Promise<UserDataResponse> => {
    // async function that receives the userID and gets the user's info from the supabase table
    try {
        const { data, error } = await supabase
            .from("users")
            .select()
            .eq('id', userId)
            .single();
            if (error) {
                return {success: false, msg: error.message};
            }
            return { success: true, data };
    } catch (error) {
        console.log('got error', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return {success: false, msg: errorMessage};
    }
}

export const updateUserProfile = async (
    userId: string, 
    updates: {
        name?: string;
        location?: string;
        interests?: string[];
        travel_preferences?: string[];
        onboarding_completed?: boolean;
        [key: string]: any;
    }
): Promise<UserDataResponse> => {
    // Update user profile in the Supabase database
    try {
        const { data, error } = await supabase
            .from("users")
            .update(updates)
            .eq('id', userId)
            .select()
            .single();
            
        if (error) {
            return { success: false, msg: error.message };
        }
        
        return { success: true, data };
    } catch (error) {
        console.log('Error updating user profile:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return { success: false, msg: errorMessage };
    }
}
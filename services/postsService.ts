import { supabase } from "../lib/supabase";

interface PostsResponse {
    success: boolean;
    msg?: string;
    data?: any[];
}

export const getPosts = async (limit: number = 50): Promise<PostsResponse> => {
    try {
        // First try with user join
        const { data, error } = await supabase
            .from("posts")
            .select(`
                *,
                users (
                    id,
                    name,
                    location
                )
            `)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) {
            console.error('Error fetching posts with join:', error);
            // Fallback: fetch posts without user join
            const { data: simpleData, error: simpleError } = await supabase
                .from("posts")
                .select('*')
                .order('created_at', { ascending: false })
                .limit(limit);
            
            if (simpleError) {
                return { success: false, msg: simpleError.message };
            }
            
            return { success: true, data: simpleData || [] };
        }

        return { success: true, data: data || [] };
    } catch (error) {
        console.error('Error fetching posts:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return { success: false, msg: errorMessage };
    }
};

export const getPostById = async (postId: string): Promise<PostsResponse> => {
    try {
        const { data, error } = await supabase
            .from("posts")
            .select(`
                *,
                users:user_id (
                    id,
                    name,
                    location
                )
            `)
            .eq('id', postId)
            .single();

        if (error) {
            return { success: false, msg: error.message };
        }

        return { success: true, data: [data] };
    } catch (error) {
        console.error('Error fetching post:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return { success: false, msg: errorMessage };
    }
};


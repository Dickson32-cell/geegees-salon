-- Allow public access to delete reviews
CREATE POLICY "Allow public delete access to reviews" ON public.reviews
    FOR DELETE USING (true);

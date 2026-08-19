class Solution {
    public int minEatingSpeed(int[] piles, int h) {
        int low = 1;
        int high = 0;
        for (int p : piles) {
            high = Math.max(high, p);
        }

        while (low < high) {
            int mid = low + (high - low) / 2;
            
            if (canEatAll(piles, h, mid)) {
                high = mid;      // mid speed works! Try searching for a slower valid speed
            } else {
                low = mid + 1;  // Too slow! Increase speed
            }
        }

        return low;
    }

    private boolean canEatAll(int[] piles, int h, int k) {
        long hoursNeeded = 0; // Use long to avoid overflow for large values
        for (int p : piles) {
            hoursNeeded += (p + k - 1) / k; // Ceil division: ceil(p / k)
        }
        return hoursNeeded <= h;
    }
}
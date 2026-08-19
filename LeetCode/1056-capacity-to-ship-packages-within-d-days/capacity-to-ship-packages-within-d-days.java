class Solution {
    public int shipWithinDays(int[] weights, int days) {
        int low = 0, high = 0;
        for (int w : weights) {
            low = Math.max(low, w);
            high += w;
        }

        while (low < high) {
            int mid = low + (high - low) / 2;
            if (canShip(weights, days, mid)) {
                high = mid;      // Try smaller capacity
            } else {
                low = mid + 1;  // Capacity too small, increase
            }
        }
        return low;
    }

    private boolean canShip(int[] weights, int days, int cap) {
        int needed = 1, current = 0;
        for (int w : weights) {
            if (current + w > cap) {
                needed++;
                current = 0;
            }
            current += w;
        }
        return needed <= days;
    }
}
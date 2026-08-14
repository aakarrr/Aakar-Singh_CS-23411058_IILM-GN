import java.util.Arrays;

class Solution {
    public int[] numMovesStonesII(int[] stones) {
        Arrays.sort(stones);
        int n = stones.length;
        
        int maxMoves = Math.max(
            stones[n - 1] - stones[1] - n + 2, 
            stones[n - 2] - stones[0] - n + 2
        );
        
        int minMoves = n;
        int left = 0;
        
        for (int right = 0; right < n; right++) {
            while (stones[right] - stones[left] + 1 > n) {
                left++;
            }
            
            int currentWindowStones = right - left + 1;
            int gapLength = stones[right] - stones[left] + 1;

            if (currentWindowStones == n - 1 && gapLength == n - 1) {
                minMoves = Math.min(minMoves, 2);
            } else {

                minMoves = Math.min(minMoves, n - currentWindowStones);
            }
        }
        
        return new int[]{minMoves, maxMoves};
    }
}
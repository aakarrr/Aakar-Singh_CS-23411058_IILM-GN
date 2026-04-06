class Solution {
    public List<List<Integer>> fourSum(int[] nums, int target) 
    {
        int a = 0;
        Arrays.sort(nums);
        List<List<Integer>> iRet = new ArrayList<>();

        while(a < nums.length-3)
        {
            if(a > 0 && nums[a] == nums[a-1]) 
            {
                a++;
                continue;
            }

            int b = a+1;
            while(b < nums.length-2)
            {
                if(b > a + 1 && nums[b] == nums[b-1])
                {
                    b++;
                    continue;
                }

                int c = b+1;
                int d = nums.length-1;

                while(c < d)
                {
                    long iSum = (long) nums[a] + nums[b] + nums[c] + nums[d];

                    if(iSum == target)
                    {
                        iRet.add(Arrays.asList(nums[a],nums[b],nums[c],nums[d]));

                        c++;
                        d--;

                        while(c < d && nums[c] == nums[c-1]) c++;
                        while(c < d && nums[d] == nums[d+1]) d--;
                    }

                    else if(iSum < target)
                    {
                        c++;
                    }
                    else
                    {
                       d--;
                    }
                }
                b++;
            }
            a++;
        }
        return iRet;
    }
}
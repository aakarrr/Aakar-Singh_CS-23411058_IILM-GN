class Solution {
    int depth = 0;
    public int maxDepth(TreeNode root) {
        if(root == null) return 0;
        pre(root, 1);
        return depth;
    }
    public void pre(TreeNode root, int d){
        if(root == null){
            return;
        }
        depth = Math.max(depth, d);
        pre(root.left, d + 1);
        pre(root.right, d + 1); 
    }
}
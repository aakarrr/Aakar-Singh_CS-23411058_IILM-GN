/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode() {}
 *     TreeNode(int val) { this.val = val; }
 *     TreeNode(int val, TreeNode left, TreeNode right) {
 *         this.val = val;
 *         this.left = left;
 *         this.right = right;
 *     }
 * }
 */
class Solution {
    
    public int sumOfLeftLeaves(TreeNode root) {
       return func(root,false);
    }
    public  int func(TreeNode root,boolean found){
         if(root==null){
            return 0;

        }
       
        if(root.left==null && root.right==null && found){
           return root.val;
         
        }
       int l= func(root.left,true);
       int r= func(root.right,false);
        return l+r;
       
    }
}
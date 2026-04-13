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
    public List<Integer> preorderTraversal(TreeNode root) {
        List<Integer> pre = new ArrayList<>();
        if (root == null) return pre;
        preOrder(pre, root);
        return pre;
    }

    public static void preOrder(List<Integer>pre, TreeNode root){
        if(root == null) return;
        // print root
        // left child
        // right child
        pre.add(root.val);
        preOrder(pre, root.left);
        preOrder(pre, root.right);
    }
}
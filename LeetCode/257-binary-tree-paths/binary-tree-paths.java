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
    public List<String> binaryTreePaths(TreeNode root) {
        List<String> list = new ArrayList();
        if(root == null) return list;
        paths(list, root, "");
        return list;
    }

    public static void paths(List<String>list, TreeNode root, String s){
        if (root == null) return;

        if(s != ""){
            s = s + "->" + root.val;
        }else{
            s = s + root.val;
        }
        paths(list, root.left, s);
        paths(list, root.right, s);

        if(root.left == null && root.right == null){
            list.add(s);
        }
    }
}
class Solution {
    public List<Integer> postorderTraversal(TreeNode root) {
        List<Integer> list = new ArrayList<>();
        postOrder(root, list);
        return list;
    }

    private void postOrder(TreeNode root, List<Integer> list) {
        if (root == null) return;

        postOrder(root.left, list);   // left
        postOrder(root.right, list);  // right
        list.add(root.val);           // root
    }
}
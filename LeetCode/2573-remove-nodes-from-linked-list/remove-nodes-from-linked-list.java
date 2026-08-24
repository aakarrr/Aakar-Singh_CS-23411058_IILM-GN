class Solution {
    public ListNode removeNodes(ListNode head) {
        head = reverse(head);

        ListNode curr = head;
        int maxVal = curr.val;

        while (curr != null && curr.next != null) {
            if (curr.next.val < maxVal) {
                curr.next = curr.next.next;
            } else {
                maxVal = curr.next.val;
                curr = curr.next;
            }
        }
        return reverse(head);
    }

    private ListNode reverse(ListNode head) {
        ListNode prev = null;
        ListNode curr = head;
        while (curr != null) {
            ListNode nextTemp = curr.next;
            curr.next = prev;
            prev = curr;
            curr = nextTemp;
        }
        return prev;
    }
}
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public ListNode deleteMiddle(ListNode head) {
        if(head == null || head.next == null) return null;
        ListNode FastPointer = head;
        ListNode SlowPointer = head;
        ListNode Temp = null;

        while( FastPointer != null && FastPointer.next != null){
            Temp = SlowPointer;
            SlowPointer = SlowPointer.next;
            FastPointer = FastPointer.next.next;
        }

        Temp.next = SlowPointer.next;
        return head;
    }

}
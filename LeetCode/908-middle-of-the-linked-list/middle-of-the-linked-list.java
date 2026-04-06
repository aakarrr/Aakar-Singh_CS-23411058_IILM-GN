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
    public ListNode middleNode(ListNode head) {
        ListNode MiddleNodeTracker = head;
        int Count= 0;
        while(head != null){
            if (Count%2 == 1) MiddleNodeTracker = MiddleNodeTracker.next;
            ++Count;
            head = head.next;
        }
    return MiddleNodeTracker;    
    }
}
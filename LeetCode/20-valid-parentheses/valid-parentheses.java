class Solution {
    public boolean isValid(String s) {
        if ((s.length() & 1) == 1) return false;

        char[] stack = new char[s.length()];
        int head = 0; 
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (c == '(') {
                stack[head++] = ')';
            } else if (c == '{') {
                stack[head++] = '}';
            } else if (c == '[') {
                stack[head++] = ']';
            } else {
                if (head == 0 || stack[--head] != c) {
                    return false;
                }
            }
        }

        return head == 0;
    }
}
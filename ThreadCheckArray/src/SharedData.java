

import java.util.ArrayList;

/**
 * A class representing shared data for use between threads.
 * Contains an array of integers, a boolean array for marking wins,
 * a boolean flag, and a constant integer.
 */
public class SharedData 
{
    private ArrayList<Integer> array = new ArrayList<>();
    private boolean[] winArray;
    private boolean flag;
    private final int b;
    
    /**
     * Constructor for SharedData class.
     * 
     * @param array An ArrayList of integers
     * @param b A constant integer value
     */
    public SharedData(ArrayList<Integer> array, int b) {
        this.array = array;
        this.b = b;
    }

    /**
     * Returns the win array.
     * 
     * @return A boolean array representing the win state
     */
    public boolean[] getWinArray() 
    {
        return winArray;
    }

    /**
     * Sets the win array.
     * 
     * @param winArray A new boolean array for marking wins
     */
    public void setWinArray(boolean[] winArray) 
    {
        this.winArray = winArray;
    }

    /**
     * Returns the array of integers.
     * 
     * @return An ArrayList of integers
     */
    public ArrayList<Integer> getArray() 
    {
        return array;
    }

    /**
     * Returns the constant value b.
     * 
     * @return The value of b
     */
    public int getB() 
    {
        return b;
    }

    /**
     * Returns the value of the flag.
     * 
     * @return The boolean value of the flag
     */
    public boolean getFlag() 
    {
        return flag;
    }

    /**
     * Sets the value of the flag.
     * 
     * @param flag The new value for the flag
     */
    public void setFlag(boolean flag) {
        this.flag = flag;
    }
}
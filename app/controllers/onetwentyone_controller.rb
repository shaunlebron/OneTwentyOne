class OnetwentyoneController < ApplicationController
  def clickBlock(x, y)
    #CLick the block at x and y.  Use the cookie to determine the new color

  end
  def getInitialColor()
    #Get the initial color for a new user that has just loaded the page

    #Get the list of random colors


    #choose a random color and return
    Random.rand(25);
    return "#000000"
  end
  def getBlocks()
    #Get the values for all the blocks
    blocks = Hash.new("#FFFFFF");

    #load blocks from the database

    return blocks;
  end
  def startNewRoom()
    #Start a new room

    #Generate a new random token, create the room, and return the token

    return "randomstringzomgzomg";
  end

  def index

  end

  def Room

  end
end

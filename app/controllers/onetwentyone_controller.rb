class OnetwentyoneController < ApplicationController


  def clickBlock
    #CLick the block at x and y.  Use the cookie to determine the new color
    x = params[:x];
    y = params[:y];
  end
  def getInitialColor
    #Get the initial color for a new user that has just loaded the page

    #Get the list of random colors


    #choose a random color and return
    Random.rand(25);
    return "#000000"
  end
  def getBlocks
    #Get the values for all the blocks
    blocks = Hash.new("#FFFFFF");

    #load blocks from the database

    return blocks;
  end
  def startNewRoom
    #render :nothing => true, :status => :ok;
    #Start a new room
    #@value = as_json(whatever="lkjslnw");d

    #Generate a new random token, create the room, and return the token
    respond_to do |format|
      format.json { render :json => {:roomKey => "lknwlnskd"} }

    end
  end

  def index

  end

  def Room

  end
end

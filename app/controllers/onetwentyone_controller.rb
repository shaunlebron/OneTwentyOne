class OnetwentyoneController < ApplicationController
  def clickBlock
    #CLick the block at x and y.  Use the cookie to determine the new color
    x = params[:x];
    y = params[:y];
    thisUser = User.find_all_by_user_key(session[:userKey]);
    colorToUse = thisUser.color;

    databaseBlock = Block.first(:conditions => ["x = ? AND y = ?", x, y]);
    databaseBlock.color = colorToUse;
  end
  def getInitialColor
    thisUser = User.new()
    thisUser.color=Random.rand(360);
    thisUser.save();
    session[:userKey] = thisUser.user_key;
    #return thisUser.color;
    respond_to do |format|
      format.json { render :json => {:color => thisUser.color } }
    end
  end
  def getBlocks
    blocks = Hash.new(-1);
    databaseBlocks = Block.find(params[:roomKey]);
    databaseBlocks.each do |d|
      blocks[[d.x, d.y]] = d.color;
    end
    respond_to do |format|
      format.json { render :json => {:blocks => blocks } }
    end
  end
  def startNewRoom
    #Generate a new random token, create the room, and return the token
    newRoom = Room.new();
    redirect_to :action => "Room", :id => newRoom.room_key;

    #respond_to do |format|
    #  format.json { render :json => {:roomKey => "lknwlnskd"} }
    #end
  end

  def index
    startNewRoom();
  end

  def Room
    if(params[:roomKey].blank?)
      startNewRoom();
    end
  end
end

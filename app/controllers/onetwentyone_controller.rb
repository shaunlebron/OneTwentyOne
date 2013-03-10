class OnetwentyoneController < ApplicationController
  def clickBlock
    #CLick the block at x and y.  Use the cookie to determine the new color
    x = params[:x];
    y = params[:y];
    thisUser = User.find_all_by_user_key(session[:userKey]).first();
    colorToUse = thisUser.color;
    roomKey = thisUser.room_key;

    databaseBlock = Block.first(:conditions => ["x = ? AND y = ? AND room_key = ?", x, y, roomKey]);

    if(databaseBlock.present?)
      databaseBlock.color = colorToUse;
      databaseBlock.save();
    else
      databaseBlock = Block.new();
      databaseBlock.color = colorToUse;
      databaseBlock.x = x;
      databaseBlock.y = y;
      databaseBlock.room_key = roomKey;
      databaseBlock.save();
    end

    respond_to do |format|
      format.json { render :json => { } }
    end
  end
  def getInitialColor
    thisUser = User.new()
    thisUser.color=Random.rand(360);
    thisUser.room_key = params[:roomKey];
    puts "TESTTEJSN";
    puts params[:roomKey];
    thisUser.save();
    session[:userKey] = thisUser.user_key;
    #return thisUser.color;
    respond_to do |format|
      format.json { render :json => {:color => thisUser.color } }
    end
  end
  def getBlocks
    blocks = Hash.new(-1);
    databaseBlocks = Block.find_all_by_room_key(params[:roomKey]);
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
    newRoom.generate_token();
    newRoom.height = 11;
    newRoom.width = 11;
    newRoom.save();
    redirect_to :controller => "Onetwentyone", :action => "Room", :roomKey => newRoom.room_key;
    #redirect_to :controller => "Onetwentyone", :action => "Room?roomKey=" + newRoom.room_key

    #respond_to do |format|
    #  format.json { render :json => {:roomKey => "lknwlnskd"} }
    #end
  end

  def index
    startNewRoom();
  end

  def Room
    if(params[:roomKey].blank? && params[:id].blank?)
      startNewRoom();
    end
  end
end

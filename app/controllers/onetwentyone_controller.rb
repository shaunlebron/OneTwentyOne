class OnetwentyoneController < ApplicationController
  
  def processData
    coordinates = params[:coordinates]

    splitCoordinates = coordinates.split("|");

    splitCoordinates.each {
      |splitCoordinate|
      xy = splitCoordinate.split(",");
      x = xy[0];
      y = xy[1];
      internalClickBlock(x, y, session[:userKey]);
    }

    getBlocks();
  end

  def getRandomRoomKeys
    rooms = Room.all(:order => 'RANDOM()', :limit => 6);
  end

  def clickBlock
    internalClickBlock(params[:x], params[:y], session[:userKey]);

    respond_to do |format|
      format.json { render :json => { } }
    end
  end

  def getInitialColor
    thisUser = User.new()
    thisUser.color=Random.rand(360);
    thisUser.room_key = params[:roomKey];
    thisUser.save();
    session[:userKey] = thisUser.user_key;
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

    room = Room.find_all_by_room_key(params[:roomKey]).first();
    coolColor = room.prominent_hex;

    respond_to do |format|
      format.json { render :json => {:blocks => blocks, :prominent => coolColor } }
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
  end

  def index
    startNewRoom();
  end

  def Room
    if(params[:roomKey].blank? && params[:id].blank?)
      startNewRoom();
    end
  end


  protected
  def internalClickBlock(x, y, userKey)
    thisUser = User.find_all_by_user_key(userKey).first();
    colorToUse = thisUser.color;
    roomKey = thisUser.room_key;

    databaseBlock = Block.where(x: x, y: y, room_key: roomKey).first();

    if(databaseBlock.present?)
      if(databaseBlock.color >= 0 && databaseBlock.color <= 360)
        databaseBlock.color = -1;
        databaseBlock.save();
      else
        databaseBlock.color = colorToUse;
        databaseBlock.save();
      end
    else
      databaseBlock = Block.new();
      databaseBlock.color = colorToUse;
      databaseBlock.x = x;
      databaseBlock.y = y;
      databaseBlock.room_key = roomKey;
      databaseBlock.save();
    end

    room = Room.find_all_by_room_key(roomKey).first();
    room.prominent_hex = colorToUse;
    room.save();
  end

end

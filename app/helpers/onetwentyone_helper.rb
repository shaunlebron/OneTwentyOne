module OnetwentyoneHelper
	def self.clickBlock(x, y, userKey)
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

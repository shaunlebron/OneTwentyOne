class AddRoomKeyToRoom < ActiveRecord::Migration
  def change
     add_column :rooms, :room_key, :string
  end
end

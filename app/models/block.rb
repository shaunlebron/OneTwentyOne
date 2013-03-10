class Block < ActiveRecord::Base
  attr_accessible :x, :y, :color, :room_key

  belongs_to :color
  belongs_to :room, foreign_key: "room_key" 
end

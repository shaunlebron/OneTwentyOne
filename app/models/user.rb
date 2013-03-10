class User < ActiveRecord::Base
  attr_accessible :room_key, :user_key, :color


  belongs_to :room, foreign_key: "room_key" 

  before_create :generate_token

  def generate_token
    begin
      user_key = SecureRandom.urlsafe_base64
    end while Room.where(room_key: user_key).exists? && User.where(user_key: user_key)
    self.user_key = user_key
  end


end

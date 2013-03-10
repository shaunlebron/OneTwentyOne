class Room < ActiveRecord::Base
 attr_accessible  :width, :height, :prominent_hex, :room_key

 has_many :users

 before_create :generate_token


  def generate_token
    begin
      room_key = SecureRandom.urlsafe_base64
    end while Room.where(room_key: room_key).exists? && User.where(user_key: room_key)
    self.room_key = room_key
  end

end

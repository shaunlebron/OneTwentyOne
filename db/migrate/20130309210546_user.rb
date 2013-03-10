class User < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :user_key
      t.string :room_key
      t.integer :color
    end
  end

end

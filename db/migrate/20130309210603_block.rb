class Block < ActiveRecord::Migration
  def change
    create_table :blocks do |t|
      t.integer :x
      t.integer :y
      t.integer :color, limit: 7
      t.string :room_key, limit: 7
    end
  end
end

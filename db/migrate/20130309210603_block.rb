class Block < ActiveRecord::Migration
  def change
    create_table :blocks do |t|
      t.integer :x
      t.integer :y
      t.integer :color
      t.string :room_key
    end
  end
end

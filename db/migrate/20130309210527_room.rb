class Room < ActiveRecord::Migration
  def change
     create_table :rooms do |t|
      t.integer :width
      t.integer :height
      t.integer :prominent_hex
    end
  end

end
